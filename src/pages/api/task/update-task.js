// pages/api/task/update-task.js
import { PrismaClient } from '@prisma/client';
import cloudinary from '../../../../lib/cloudinary';
import formidable from 'formidable';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for file upload handling
  },
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing the files' });
      }

      // Extract the first element from the arrays
      const { id, title, description } = {
        id: fields.id[0],
        title: fields.title[0],
        description: fields.description[0],
      };

      const logoFile = files.logo ? files.logo[0] : null;
      const coverImageFile = files.coverImage ? files.coverImage[0] : null;

      try {
        let logoUrl = '';
        let coverImageUrl = '';

        // Check and upload the logo file if it exists
        if (logoFile && logoFile.filepath) {
          console.log('Uploading logo file from path:', logoFile.filepath);
          const logoUpload = await cloudinary.uploader.upload(logoFile.filepath);
          logoUrl = logoUpload.secure_url;
        }

        // Check and upload the cover image file if it exists
        if (coverImageFile && coverImageFile.filepath) {
          console.log('Uploading cover image file from path:', coverImageFile.filepath);
          const coverUpload = await cloudinary.uploader.upload(coverImageFile.filepath);
          coverImageUrl = coverUpload.secure_url;
        }

        // Update the task in the database
        const updatedTask = await prisma.task.update({
          where: { id: Number(id) },
          data: {
            title,
            description,
            logo: logoUrl || undefined,
            coverImage: coverImageUrl || undefined,
          },
        });

        return res.status(200).json(updatedTask);
      } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ error: 'Error updating task' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
