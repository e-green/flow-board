import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Corrected to actual SMTP host
    port: process.env.EMAIL_PORT,
    secure: false, // Use true for port 465 (SSL), false for other ports (TLS)
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // App password or your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <!-- Site Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="../src/app/images/flowBoardLogo.png" alt="FlowBoard Logo" style="max-width: 100%; height: auto;" />
        </div>
        
        <h2 style="color: #333;">We’re excited to have you on board!</h2>
        <p style="color: #333;">Before we get started, first, we need to be sure you're you and verify your email address. Please click on the button below to verify your email.</p>
  
        <!-- Verification button -->
        <div style="margin: 10px 0;">
          <a href="${process.env.FRONTEND_URL}/api/user/verify-email?token=${token}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
  
        <p style="color: #777;">If the button doesn't work, please copy and paste the following URL into your browser:</p>
        <p style="color: #007BFF;">
          ${process.env.FRONTEND_URL}/api/user/verify-email?token=${token}
        </p>
  
        <p>Thank you,<br>The FlowBoard Team</p>
      </div>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // This will be caught by your API route and return a 500 error
  }
};
