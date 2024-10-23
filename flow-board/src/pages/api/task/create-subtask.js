import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, taskId } = req.body;

    try {
      const subTask = await prisma.subTask.create({
        data: {
          title,
          taskId,
        },
      });
      res.status(200).json(subTask);
    } catch (error) {
      res.status(500).json({ error: 'Error creating subtask' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
