import { PrismaClient } from '@prisma/client';
import cloudinary from '../../../../lib/cloudinary'; // Your Cloudinary configuration
import formidable from 'formidable';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const title = fields.title[0];
      const description = fields.description[0];
      const userId = parseInt(fields.userId[0], 10);
      const assigneeEmails = fields.assignees ? JSON.parse(fields.assignees[0]) : []; // Parse assignees array
      let coverImageUrl = null;
      let logoUrl = null;

      // Upload cover image to Cloudinary
      if (files.coverImage && files.coverImage[0].filepath) {
        try {
          const coverImage = await cloudinary.uploader.upload(files.coverImage[0].filepath, {
            folder: 'tasks',
          });
          coverImageUrl = coverImage.secure_url;
        } catch (error) {
          console.error('Error uploading cover image:', error);
        }
      }

      // Upload logo to Cloudinary
      if (files.logo && files.logo[0].filepath) {
        try {
          const logo = await cloudinary.uploader.upload(files.logo[0].filepath, {
            folder: 'tasks',
          });
          logoUrl = logo.secure_url;
        } catch (error) {
          console.error('Error uploading logo:', error);
        }
      }

      try {
        // Validate assignee emails
        const assignees = await prisma.user.findMany({
          where: {
            email: { in: assigneeEmails },
          },
          select: { id: true },
        });

        if (assignees.length !== assigneeEmails.length) {
          const invalidEmails = assigneeEmails.filter(
            email => !assignees.some(user => user.email === email)
          );
          return res.status(400).json({ error: `The following emails are not valid users in Flowboard: ${invalidEmails.join(', ')}. Please ensure they are registered.` });
        }

        // Create the task with assignees
        const task = await prisma.task.create({
          data: {
            title,
            description,
            userId,
            coverImage: coverImageUrl,
            logo: logoUrl,
            assignees: {
              connect: assignees.map(assignee => ({ id: assignee.id })),
            },
          },
        });

        return res.status(200).json(task);
      } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ error: error.message || 'Error creating task' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
}
