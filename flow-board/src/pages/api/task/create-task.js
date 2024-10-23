import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, userId } = req.body;

    try {
      // Create task with the userId
      const task = await prisma.task.create({
        data: {
          title,
          description,
          userId, // This should be passed from the frontend
        },
      });
      res.status(200).json(task); // Return the created task
    } catch (error) {
      console.error('Error creating task:', error); // Log the error for debugging
      res.status(500).json({ error: error.message || 'Error creating task' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
