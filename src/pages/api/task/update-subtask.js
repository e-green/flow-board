import { PrismaClient } from "@prisma/client";
import cloudinary from "../../../../lib/cloudinary";
import formidable from "formidable";
const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for file upload handling
  },
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing the files" });
      }

      const id = parseInt(fields.id[0]);
      const title = fields.title[0];
      const status = fields.status[0];
      let assigneesEmails = [];
      try {
        assigneesEmails = fields.assignees
          ? JSON.parse(fields.assignees[0])
          : [];
      } catch (e) {
        console.error("Error parsing assignees:", e.message);
        return res.status(400).json({ error: "Invalid assignees format" });
      }

      const imagesFile = files.images ? files.images[0] : null;
      const documentFile = files.documents ? files.documents[0] : null;

      try {
        let imageUrl = "";
        let documnetUrl = "";

        // Upload images if provided
        if (imagesFile?.filepath) {
          const imageUpload = await cloudinary.uploader.upload(
            imagesFile.filepath,
            {
              folder: "tasks",
            }
          );
          imageUrl = imageUpload.secure_url;
        }

        // Upload cover image if provided
        if (documentFile?.filepath) {
          const documentUpload = await cloudinary.uploader.upload(
            documentFile.filepath,
            {
              folder: "tasks",
            }
          );
          documnetUrl = documentUpload.secure_url;
        }

        let assigneesEmails = [];
        try {
          assigneesEmails = fields.assignees
            ? JSON.parse(fields.assignees[0])
            : [];
        } catch (e) {
          console.error("Error parsing assignees:", e.message);
          return res.status(400).json({ error: "Invalid assignees format" });
        }

        const assignees = await prisma.user.findMany({
          where: { email: { in: assigneesEmails } },
          select: { id: true, email: true }, // Include email for validation
        });
        

        if (assignees.length !== assigneesEmails.length) {
          const invalidEmails = assigneesEmails.filter(
            (email) => !assignees.some((user) => user.email === email)
          );
          return res
            .status(400)
            .json({ error: `Invalid assignees: ${invalidEmails.join(", ")}` });
        }

        // Update the task
        const updatedTask = await prisma.task.update({
          where: { id },
          data: {
            title,
            description,
            status,
            images: imageUrl || undefined,
            documents: documnetUrl || undefined,
            assignees: {
              set: assignees.map((assignee) => ({ id: assignee.id })), // Replace existing assignees
            },
          },
        });

        res.status(200).json(updatedTask);
      } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Error updating task" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
export default handler;