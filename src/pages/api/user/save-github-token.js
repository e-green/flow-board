import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, token } = req.body; // Correctly handle `token` from the frontend.

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { githubToken: token },
      });

      res.status(200).json({ message: 'GitHub token saved successfully', user: updatedUser });
    } catch (error) {
      console.error('Error saving GitHub token:', error);
      res.status(500).json({ error: 'Failed to save GitHub token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
