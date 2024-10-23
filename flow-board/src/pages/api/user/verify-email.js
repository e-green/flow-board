// pages/api/verify-email.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('<h1>Invalid token</h1>');
  }

  try {
    // Find the user by the token
    const user = await prisma.user.findFirst({
      where: { verification_token: token },
    });

    if (!user) {
      return res.status(400).send('<h1>Invalid or expired token</h1>');
    }

    // Optionally, check if the token has expired
    const currentTime = new Date();
    if (user.token_expiration && new Date(user.token_expiration) < currentTime) {
      return res.status(400).send('<h1>Token has expired</h1>');
    }

    // Update the user to mark them as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verification_token: null,  // Clear the token
        token_expiration: null,    // Clear the expiration if used
      },
    });

    // Respond with a professional success message
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verified</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 50px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              h1 {
                  color: #4CAF50;
              }
              p {
                  font-size: 1.1em;
              }
              a {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 10px 20px;
                  background-color: #4CAF50;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
              }
              a:hover {
                  background-color: #45a049;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Email Verified Successfully!</h1>
              <p>Thank you for verifying your email. You can now log in to your account.</p>
              <a href="${process.env.FRONTEND_URL}/components/user/login">Go to Login</a>
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).send('<h1>Error verifying email</h1>');
  }
}
