import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, taskId } = req.body;
      const numericTaskId = Number(taskId); // Convert taskId to a number

      if (isNaN(numericTaskId)) {
        return res.status(400).json({ error: 'Invalid taskId: taskId should be a number.' });
      }

      // Check if the taskId exists
      const taskExists = await prisma.task.findUnique({
        where: { id: numericTaskId },
      });

      if (!taskExists) {
        return res.status(404).json({ error: `Task with id ${numericTaskId} does not exist.` });
      }

      // Create the subtask
      const newSubtask = await prisma.subTask.create({
        data: {
          title,
          taskId: numericTaskId,
        },
      });

      res.status(201).json(newSubtask);
    } catch (error) {
      console.error('Error creating subtask:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
