const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// MongoDB connection (optional)
let Meeting;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(() => {
    console.log('⚠️ MongoDB connection failed, continuing without DB');
  });

  const meetingSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: String,
    time: String,
    message: String,
    meetingLink: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
  });

  Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
}

// Helper function to generate meeting ID
function generateMeetingId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Email service functions
const sendMeetingConfirmationToClient = async (meetingData) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
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

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Meeting confirmation email sent to client:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending meeting confirmation to client:', error.message);
    return false;
  }
};

const sendMeetingNotificationToOwner = async (meetingData) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'ctoshadowlink@gmail.com',
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

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Meeting notification email sent to owner:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending meeting notification to owner:', error.message);
    return false;
  }
};

// Simple validation function
const validateMeeting = (data) => {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push({ field: 'email', message: 'Please provide a valid email' });
    }
  }
  
  if (!data.date || typeof data.date !== 'string' || data.date.trim().length === 0) {
    errors.push({ field: 'date', message: 'Date is required' });
  }
  
  if (!data.time || typeof data.time !== 'string' || data.time.trim().length === 0) {
    errors.push({ field: 'time', message: 'Time is required' });
  }
  
  return errors;
};

// Vercel serverless function
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Validate input
    const validationErrors = validateMeeting(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    const { name, email, date, time, message } = req.body;

    // Check if there's already a meeting at this time (if DB available)
    if (Meeting && process.env.MONGODB_URI) {
      try {
        const existingMeeting = await Meeting.findOne({
          date,
          time,
          status: { $in: ['pending', 'confirmed'] },
        });

        if (existingMeeting) {
          return res.status(400).json({
            success: false,
            message: 'This time slot is already booked. Please select another time.',
          });
        }
      } catch (dbError) {
        console.error('⚠️ Database check failed (continuing anyway):', dbError.message);
      }
    }

    // Generate meeting link
    const meetingLink = `https://meet.google.com/${generateMeetingId()}`;

    // Try to save to database (optional)
    let meetingId = null;
    if (Meeting && process.env.MONGODB_URI) {
      try {
        const meeting = new Meeting({
          name,
          email,
          date,
          time,
          message: message || '',
          meetingLink,
        });
        await meeting.save();
        meetingId = meeting._id;
        console.log('✅ Meeting saved to database:', meetingId);
      } catch (dbError) {
        console.error('⚠️ Database save failed (continuing anyway):', dbError.message);
      }
    }

    // Send confirmation email to client
    const clientEmailSent = await sendMeetingConfirmationToClient({
      name,
      email,
      date,
      time,
      message: message || '',
      meetingLink,
    });

    // Send notification email to owner (IMPORTANT - this must work)
    const ownerEmailSent = await sendMeetingNotificationToOwner({
      name,
      email,
      date,
      time,
      message: message || '',
      meetingLink,
    });

    if (!ownerEmailSent) {
      console.error('⚠️ CRITICAL: Owner email notification failed!');
    }

    return res.status(201).json({
      success: true,
      message: ownerEmailSent
        ? 'Meeting booked successfully! Check your email for confirmation.'
        : 'Meeting booked, but email notification failed. Please contact directly.',
      data: {
        id: meetingId,
        date,
        time,
        clientEmailSent,
        ownerEmailSent,
      },
    });
  } catch (error) {
    console.error('Meeting booking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to book meeting',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

