import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
        select: { githubToken: true },
      });

      if (!user || !user.githubToken) {
        return res.status(404).json({ error: 'GitHub token not found' });
      }

      res.status(200).json({ token: user.githubToken });
    } catch (error) {
      console.error('Error fetching GitHub token:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
