import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { userId, date } = req.body;
  
      if (!userId || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      await prisma.note.delete({
        where: {
          userId_date: {
            userId: parseInt(userId),
            date: new Date(date)
          }
        }
      });
  
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting note:', error);
      return res.status(500).json({ error: 'Failed to delete note' });
    }
  }