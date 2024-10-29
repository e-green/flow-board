// pages/api/task/create-subtask.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, taskId, parentId, description, status, images, documents } = req.body;

    try {
      const subtask = await prisma.subTask.create({
        data: {
          title,
          description: description || null,
          status: status || "Not Started", // Default to "Not Started"
          images: images || [], // Empty array if no images
          documents: documents || [], // Empty array if no documents
          taskId: parseInt(taskId),
          parentId: parentId ? parseInt(parentId) : null,
        },
      });
      res.status(200).json(subtask);
    } catch (error) {
      console.error('Error creating subtask:', error);
      res.status(500).json({ error: 'Error creating subtask' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
