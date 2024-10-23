// pages/api/update-account.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { email, name, newEmail } = req.body;

    if (!email || !name || !newEmail) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      // Update the user's name and email
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name,
          email: newEmail,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating account:', error);
      return res.status(500).json({ message: 'Error updating account' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
