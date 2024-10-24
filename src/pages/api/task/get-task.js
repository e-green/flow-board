// pages/api/task/get-task.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { taskId } = req.query;

    try {
      const task = await prisma.task.findUnique({
        where: { id: parseInt(taskId) },
        include: { subTasks: true },
      });
      res.status(200).json(task);
    } catch (error) {
      console.error('Error fetching task details:', error);
      res.status(500).json({ error: 'Error fetching task details' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
