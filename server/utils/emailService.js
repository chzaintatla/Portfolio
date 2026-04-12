const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file');
    return null;
  }

  try {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } catch (error) {
    console.error('❌ Error creating email transporter:', error);
    return null;
  }
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@sparkwave.dev';

// Send contact form email
const sendContactEmail = async (contactData) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('❌ Cannot send email: Transporter not available');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@sparkwave.dev',
    to: ADMIN_EMAIL,
    subject: `New Contact Form Submission from ${contactData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e3a8a; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #1e3a8a; }
            .label { font-weight: bold; color: #1e3a8a; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Lead Captured</h1>
            </div>
            <div class="content">
              <div class="info-box">
                <p><span class="label">Name:</span> ${contactData.name}</p>
              </div>
              <div class="info-box">
                <p><span class="label">Email:</span> ${contactData.email}</p>
              </div>
              <div class="info-box">
                <p><span class="label">Message:</span></p>
                <p>${contactData.message}</p>
              </div>
            </div>
            <div class="footer">
              <p>Sent from SparkWave Digital Solutions Portal</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending contact email:', error.message);
    return false;
  }
};

// Send meeting confirmation email to client
const sendMeetingConfirmationToClient = async (meetingData) => {
  const transporter = createTransporter();
  
  if (!transporter) return false;

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@sparkwave.dev',
    to: meetingData.email,
    subject: 'Meeting Confirmation - SparkWave Growth Call',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e3a8a; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .meeting-details { background: #e0f2fe; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Meeting Confirmed! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${meetingData.name},</p>
              <p>Your strategy call with SparkWave Digital Solutions is confirmed. We look forward to exploring your project!</p>
              
              <div class="meeting-details">
                <h2 style="color: #1e3a8a; margin-top: 0;">Meeting Details</h2>
                <p><strong>Date:</strong> ${new Date(meetingData.date).toDateString()}</p>
                <p><strong>Time:</strong> ${meetingData.time}</p>
              </div>

              <p>An admin or assigned strategist will contact you shortly with the meeting link.</p>
              
              <p>Best regards,<br><strong>SparkWave Digital Solutions</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} SparkWave Digital Solutions</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error.message);
    return false;
  }
};

// Send meeting notification to owner
const sendMeetingNotificationToOwner = async (meetingData) => {
  const transporter = createTransporter();
  if (!transporter) return false;

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@sparkwave.dev',
    to: ADMIN_EMAIL,
    subject: `New Meeting Booking: ${meetingData.name}`,
    html: `<p>New booking received for ${meetingData.date} at ${meetingData.time} from ${meetingData.name} (${meetingData.email}).</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  sendContactEmail,
  sendMeetingConfirmationToClient,
  sendMeetingNotificationToOwner,
};
