const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// MongoDB connection (optional)
let Contact;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(() => {
    console.log('⚠️ MongoDB connection failed, continuing without DB');
  });

  const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
  });

  Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
}

// Email service
const sendContactEmail = async (contactData) => {
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

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending contact email:', error.message);
    return false;
  }
};

// Simple validation function
const validateContact = (data) => {
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
  
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push({ field: 'message', message: 'Message is required' });
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
    const validationErrors = validateContact(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    const { name, email, message } = req.body;

    // Try to save to database (optional)
    let contactId = null;
    if (Contact && process.env.MONGODB_URI) {
      try {
        const contact = new Contact({ name, email, message });
        await contact.save();
        contactId = contact._id;
        console.log('✅ Contact saved to database:', contactId);
      } catch (dbError) {
        console.error('⚠️ Database save failed (continuing anyway):', dbError.message);
      }
    }

    // Send email (this is the important part)
    const emailSent = await sendContactEmail({ name, email, message });

    if (!emailSent) {
      console.error('⚠️ Email sending failed');
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? 'Contact form submitted successfully! I\'ll get back to you soon.'
        : 'Contact form submitted, but email notification failed. Please try again or contact directly.',
      data: {
        id: contactId,
        emailSent,
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

