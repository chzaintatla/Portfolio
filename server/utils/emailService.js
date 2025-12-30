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

// Send contact form email
const sendContactEmail = async (contactData) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('❌ Cannot send email: Transporter not available');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@portfolio.com',
    to: 'ctoshadowlink@gmail.com', // Your email
    subject: `New Contact Form Submission from ${contactData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #0ea5e9; }
            .label { font-weight: bold; color: #0ea5e9; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
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
              <p>This email was sent from your portfolio website contact form.</p>
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
    console.error('Full error:', error);
    return false;
  }
};

// Send meeting confirmation email to client
const sendMeetingConfirmationToClient = async (meetingData) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('❌ Cannot send email: Transporter not available');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@portfolio.com',
    to: meetingData.email,
    subject: 'Meeting Confirmation - 30-Minute Consultation',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #0ea5e9; }
            .meeting-details { background: #e0f2fe; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
            .button { display: inline-block; padding: 12px 30px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
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
              <p>Thank you for booking a 30-minute consultation with me. I'm excited to discuss your Android app project!</p>
              
              <div class="meeting-details">
                <h2 style="color: #0ea5e9; margin-top: 0;">Meeting Details</h2>
                <p><strong>Date:</strong> ${new Date(meetingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> ${meetingData.time}</p>
                <p><strong>Duration:</strong> 30 minutes</p>
              </div>

              <div class="info-box">
                <p><strong>Meeting Link:</strong></p>
                <p>The meeting link will be sent to you via email 24 hours before the scheduled time, or you can use:</p>
                <a href="${meetingData.meetingLink || 'https://meet.google.com/your-meeting-link'}" class="button">Join Google Meet</a>
              </div>

              ${meetingData.message ? `<div class="info-box"><p><strong>Your Message:</strong></p><p>${meetingData.message}</p></div>` : ''}

              <p>If you need to reschedule or cancel, please reply to this email at least 24 hours before the meeting.</p>
              
              <p>Looking forward to our conversation!</p>
              <p>Best regards,<br><strong>Digital Optimistic</strong><br>Full-Stack Development & Digital Solutions</p>
              </div>
              <div class="footer">
                <p>This is an automated confirmation email from Digital Optimistic's portfolio website.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Meeting confirmation email sent to client:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending meeting confirmation to client:', error.message);
    console.error('Full error:', error);
    return false;
  }
};

// Send meeting notification to owner
const sendMeetingNotificationToOwner = async (meetingData) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('❌ Cannot send email: Transporter not available');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@portfolio.com',
    to: 'ctoshadowlink@gmail.com', // Your email
    subject: `New Meeting Booking: ${meetingData.name} - ${meetingData.date} at ${meetingData.time}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #0ea5e9; }
            .meeting-details { background: #e0f2fe; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Meeting Booking</h1>
            </div>
            <div class="content">
              <div class="meeting-details">
                <h2 style="color: #0ea5e9; margin-top: 0;">Meeting Details</h2>
                <p><strong>Date:</strong> ${new Date(meetingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> ${meetingData.time}</p>
                <p><strong>Duration:</strong> 30 minutes</p>
              </div>

              <div class="info-box">
                <p><strong>Client Name:</strong> ${meetingData.name}</p>
                <p><strong>Email:</strong> ${meetingData.email}</p>
              </div>

              ${meetingData.message ? `<div class="info-box"><p><strong>Client Message:</strong></p><p>${meetingData.message}</p></div>` : ''}

              <p>Please make sure to send the meeting link to the client and prepare for the consultation.</p>
            </div>
            <div class="footer">
              <p>This is an automated notification from your portfolio website.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Meeting notification email sent to owner:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending meeting notification to owner:', error.message);
    console.error('Full error:', error);
    return false;
  }
};

module.exports = {
  sendContactEmail,
  sendMeetingConfirmationToClient,
  sendMeetingNotificationToOwner,
};

