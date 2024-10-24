import { PrismaClient } from '@prisma/client';
import cloudinary from '../../../../lib/cloudinary';  // Your Cloudinary configuration
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

      // console.log('Received fields:', fields); // Debugging line
      // console.log('Received files:', files);   // Debugging line

      // Access the first element of the arrays
      const title = fields.title[0];
      const description = fields.description[0];
      const userId = parseInt(fields.userId[0], 10);
      let coverImageUrl = null;
      let logoUrl = null;

      // Upload cover image to Cloudinary
      if (files.coverImage && files.coverImage[0].filepath) {
        const coverImage = await cloudinary.uploader.upload(files.coverImage[0].filepath, {
          folder: 'tasks',
        });
        coverImageUrl = coverImage.secure_url;
      } else {
        console.error('Cover image not uploaded or missing'); // Debugging line
      }

      // Upload logo to Cloudinary
      if (files.logo && files.logo[0].filepath) {
        const logo = await cloudinary.uploader.upload(files.logo[0].filepath, {
          folder: 'tasks',
        });
        logoUrl = logo.secure_url;
      } else {
        console.error('Logo not uploaded or missing'); // Debugging line
      }

      try {
        const task = await prisma.task.create({
          data: {
            title,
            description,
            userId,
            coverImage: coverImageUrl,
            logo: logoUrl,
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
