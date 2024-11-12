// pages/api/task/delete-task.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { taskId } = req.query;

    try {
      // Parse taskId to ensure it's a valid integer
      const id = parseInt(taskId, 10);

      // Check if the task exists before attempting deletion
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Attempt to delete the task
      await prisma.task.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error("Error deleting task:", error); // Log detailed error for debugging
      res.status(500).json({ error: 'Failed to delete task', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
