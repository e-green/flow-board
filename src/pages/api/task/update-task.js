// pages/api/task/update-task.js
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
      const description = fields.description[0];
      let assigneesEmails = [];
      try {
        assigneesEmails = fields.assignees
          ? JSON.parse(fields.assignees[0])
          : [];
      } catch (e) {
        console.error("Error parsing assignees:", e.message);
        return res.status(400).json({ error: "Invalid assignees format" });
      }

      const logoFile = files.logo ? files.logo[0] : null;
      const coverImageFile = files.coverImage ? files.coverImage[0] : null;

      try {
        let logoUrl = "";
        let coverImageUrl = "";

        // Upload logo if provided
        if (logoFile?.filepath) {
          const logoUpload = await cloudinary.uploader.upload(
            logoFile.filepath,
            {
              folder: "tasks",
            }
          );
          logoUrl = logoUpload.secure_url;
        }

        // Upload cover image if provided
        if (coverImageFile?.filepath) {
          const coverUpload = await cloudinary.uploader.upload(
            coverImageFile.filepath,
            {
              folder: "tasks",
            }
          );
          coverImageUrl = coverUpload.secure_url;
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
            logo: logoUrl || undefined,
            coverImage: coverImageUrl || undefined,
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
