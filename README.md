# Personal Portfolio Website

A modern, fully responsive portfolio website for **Digital Optimistic** - Full-Stack Development & Digital Solutions Company with 6+ years of experience.

## 🚀 Features

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Modern UI/UX**: Beautiful animations and professional design
- **Contact Form**: Direct email integration via Nodemailer
- **Meeting Scheduler**: Book 30-minute consultation meetings
- **Project Showcase**: Display featured Android projects
- **Experience Timeline**: Professional work history
- **Skills Section**: Comprehensive technical expertise
- **SEO Optimized**: Meta tags and semantic HTML

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- Framer Motion (animations)
- React Icons
- React DatePicker
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Nodemailer
- Express Validator

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd portfolio
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 5. Gmail App Password Setup

For Gmail, you need to:

1. Enable **2-Factor Authentication** on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this app password in `EMAIL_PASS` (not your regular Gmail password)

### 6. Start MongoDB

**Local MongoDB:**
```bash
# Make sure MongoDB is running
mongod
```

**MongoDB Atlas:**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `.env`

## 🚀 Running the Application

### Development Mode (Both Frontend & Backend)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- React app on `http://localhost:3000`

### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## 📁 Project Structure

```
portfolio/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Navbar.js
│   │   │   ├── Hero.js
│   │   │   ├── About.js
│   │   │   ├── Skills.js
│   │   │   ├── Experience.js
│   │   │   ├── Projects.js
│   │   │   ├── MeetingScheduler.js
│   │   │   ├── Contact.js
│   │   │   └── Footer.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   │   ├── Contact.js
│   │   └── Meeting.js
│   ├── routes/            # API routes
│   │   ├── contact.js
│   │   └── meeting.js
│   ├── utils/             # Utility functions
│   │   └── emailService.js
│   └── index.js          # Server entry point
├── .env                   # Environment variables (create this)
├── .env.example          # Example env file
├── package.json
└── README.md
```

## 🌐 API Endpoints

### Contact Form
- **POST** `/api/contact`
  - Body: `{ name, email, message }`
  - Sends email notification

### Meeting Booking
- **POST** `/api/meeting/book`
  - Body: `{ name, email, date, time, message? }`
  - Sends confirmation emails to both client and owner

### Health Check
- **GET** `/api/health`
  - Returns server status

## 🎨 Customization

### Colors
Edit `client/tailwind.config.js` to change the color scheme:

```javascript
colors: {
  primary: { ... },
  accent: { ... },
}
```

### Content
Update component files in `client/src/components/` to modify:
- Personal information
- Skills
- Experience
- Projects
- Contact details

### Email Templates
Customize email templates in `server/utils/emailService.js`

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the React app:
```bash
cd client
npm run build
```

2. Deploy the `client/build` folder to Vercel or Netlify

### Backend (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Update API URLs in frontend components (replace `localhost:5000` with your backend URL)
3. Deploy the `server` folder

### MongoDB Atlas

Use MongoDB Atlas for cloud database:
1. Create a free cluster
2. Get connection string
3. Update `MONGODB_URI` in `.env`

## 🐛 Troubleshooting

### Email Not Sending
- Verify Gmail app password is correct
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Ensure 2FA is enabled on Gmail account

### MongoDB Connection Error
- Verify MongoDB is running (local) or connection string is correct (Atlas)
- Check `MONGODB_URI` in `.env`

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Or kill the process using the port

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Digital Optimistic**
- Email: contact@digitaloptimistic.com
- Phone: +1 (307) 310-4711
- LinkedIn: [Digital Optimistic LLC](https://www.linkedin.com/company/digital-optimistic/)
- Facebook: [Digital Optimistic LLC](https://www.facebook.com/people/Digital-Optimistic-LLC/61584332251308/)
- Instagram: [@digitaloptimisticllc](https://www.instagram.com/digitaloptimisticllc?utm_source=qr&igsh=MWxtMzloZWEwZThlYw==)

## 🙏 Acknowledgments

- React.js community
- Tailwind CSS team
- All open-source contributors

---

**Built with ❤️ by Digital Optimistic**

