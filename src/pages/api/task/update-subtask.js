import { PrismaClient } from "@prisma/client";
import cloudinary from "../../../../lib/cloudinary";
import formidable from "formidable";
const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for file upload handling
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id, title, status, images, documents } = req.body;
      const numericSubTaskId = Number(id);

      if (isNaN(numericSubTaskId)) {
        return res.status(400).json({ error: 'Invalid subtask ID: id should be a number.' });
      }

      // Check if the subtask ID exists
      const subTaskExists = await prisma.subTask.findUnique({
        where: { id: numericSubTaskId },
      });

      if (!subTaskExists) {
        return res.status(404).json({ error: `Subtask with ID ${numericSubTaskId} does not exist.` });
      }

      // Update the subtask
      const updatedSubtask = await prisma.subTask.update({
        where: { id: numericSubTaskId },
        data: {
          title,
          status, // Update the status
          images, // Update the array of image URLs
          documents, // Update the array of document URLs
        },
      });

      res.status(200).json(updatedSubtask);
    } catch (error) {
      console.error('Error updating subtask:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
