import { sendVerificationEmail } from '../../../../lib/sendEmail';
import crypto from 'crypto';
import bcrypt from 'bcrypt';  // Import bcrypt to hash the password
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Email, name, and password are required' });
    }

    try {
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds

      // Generate a verification token
      const token = crypto.randomBytes(32).toString('hex');

      // Optionally set token expiration (e.g., 1 hour from now)
      const tokenExpiration = new Date();
      tokenExpiration.setHours(tokenExpiration.getHours() + 1); // 1-hour expiration

      // Save user to the database with the hashed password and token
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,  // Save hashed password
          verification_token: token,
          token_expiration: tokenExpiration,  // Optional
        },
      });

      // Send verification email
      await sendVerificationEmail(email, token);
      console.log(`Verification email sent to ${email}`);

      return res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
      console.error('Error saving user or sending email:', error);
      return res.status(500).json({ message: 'Failed to send verification email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
