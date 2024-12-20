import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { userId, date, content } = req.body;
  
      if (!userId || !date || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const note = await prisma.note.upsert({
        where: {
          userId_date: {
            userId: parseInt(userId),
            date: new Date(date)
          }
        },
        update: {
          content: content
        },
        create: {
          userId: parseInt(userId),
          date: new Date(date),
          content: content
        }
      });
  
      return res.status(200).json(note);
    } catch (error) {
      console.error('Error saving note:', error);
      return res.status(500).json({ error: 'Failed to save note', details: error.message });
    }
  }