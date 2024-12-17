// pages/api/task/update-subtask.js
import { PrismaClient } from "@prisma/client";
import cloudinary from "../../../../lib/cloudinary";
import formidable from "formidable";
import fs from "fs";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadToCloudinary = async (file, folder) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file.filepath, {
      folder: folder,
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing the files" });
      }

      try {
        // Parse fields
        const subTaskId = parseInt(fields.id[0]);
        const title = fields.title[0];
        const status = fields.status[0];

        // Parse and validate assignees
        let assigneesEmails = [];
        try {
          assigneesEmails = fields.assignees
            ? JSON.parse(fields.assignees[0])
            : [];
        } catch (e) {
          console.error("Error parsing assignees:", e.message);
          return res.status(400).json({ error: "Invalid assignees format" });
        }

        // Find assignee user IDs
        const assignees = await prisma.user.findMany({
          where: { email: { in: assigneesEmails } },
          select: { id: true },
        });

        // Upload images
        const imageUrls = [];
        if (files.images) {
          const imageFiles = Array.isArray(files.images) 
            ? files.images 
            : [files.images[0]];

          for (const imageFile of imageFiles) {
            const imageUrl = await uploadToCloudinary(imageFile, "tasks");
            if (imageUrl) imageUrls.push(imageUrl);
          }
        }

        // Upload documents
        const documentUrls = [];
        if (files.documents) {
          const documentFiles = Array.isArray(files.documents) 
            ? files.documents 
            : [files.documents[0]];

          for (const docFile of documentFiles) {
            const docUrl = await uploadToCloudinary(docFile, "tasks");
            if (docUrl) documentUrls.push(docUrl);
          }
        }

        // Update subtask
        const updatedSubTask = await prisma.subTask.update({
          where: { id: subTaskId },
          data: {
            title,
            status,
            assignees: {
              set: assignees.map(assignee => ({ id: assignee.id })),
            },
            images: imageUrls,
            documents: documentUrls,
          },
          include: {
            assignees: true,
          },
        });

        res.status(200).json(updatedSubTask);
      } catch (error) {
        console.error("Error updating subtask:", error);
        res.status(500).json({ error: "Error updating subtask", details: error.message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}