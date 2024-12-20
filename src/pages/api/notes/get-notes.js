import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { userId, startDate, endDate } = req.query;
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      const notes = await prisma.note.findMany({
        where: {
          userId: parseInt(userId),
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        orderBy: {
          date: 'asc'
        }
      });
  
      return res.status(200).json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      return res.status(500).json({ error: 'Failed to fetch notes' });
    }
  }