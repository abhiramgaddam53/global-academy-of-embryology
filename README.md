
# 🧬 Global Academy of Embryology

> A professional learning platform for embryology professionals worldwide

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=flat&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat&logo=tailwindcss)
![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**Global Academy of Embryology** is a cutting-edge platform designed to connect embryology professionals with world-class educational resources, webinars, and networking opportunities. Built with modern web technologies, it provides a seamless experience for learning and professional development.

### Key Objectives

- 🎓 **Education**: Provide access to expert-led webinars and educational content
- 🌐 **Global Reach**: Connect professionals worldwide
- 📜 **Certification**: Track and certify professional development
- 👥 **Community**: Foster networking and knowledge sharing

---

## ✨ Features

### For Users

- ✅ **Dual Authentication**: Login with email OR mobile number
- 👤 **Profile Management**: Complete professional profile with image upload
- 📅 **Webinar Registration**: Register for upcoming webinars with countdown timers
- 🎥 **Live Sessions**: Join live webinars via external platforms (Zoom, Google Meet)
- 📺 **Recorded Content**: Access past webinar recordings
- 🔐 **Secure Authentication**: JWT-based auth with HTTP-only cookies
- 📱 **Responsive Design**: Works seamlessly on all devices

### For Admins

- 🎛️ **Content Management**: Create, update, and delete webinars
- 📸 **Media Upload**: Upload images to AWS S3
- 👥 **Faculty Management**: Add and manage faculty profiles
- 📊 **User Management**: View and manage registered users
- 🔒 **Role-Based Access**: Secure admin-only routes

### Coming Soon

- 📜 **Certificate Generation**: Auto-generate completion certificates
- 💳 **Payment Integration**: Paid webinars and subscriptions
- 📧 **Email Notifications**: Automated reminders and confirmations
- 📈 **Analytics Dashboard**: Track engagement and performance

---

## 🛠 Tech Stack

### Frontend

```
Next.js 14       - React framework with App Router
TypeScript       - Type-safe JavaScript
Tailwind CSS     - Utility-first CSS framework
GSAP             - Professional-grade animations
Lucide React     - Beautiful icon library
```

### Backend

```
Next.js API      - RESTful API routes
MongoDB Atlas    - Cloud NoSQL database
Mongoose         - Elegant MongoDB ODM
```

### Authentication & Security

```
bcryptjs         - Password hashing (12 rounds)
jsonwebtoken     - JWT token generation
cookie           - HTTP-only cookie management
```

### External Services

```
AWS S3           - File storage
Gmail SMTP       - Email delivery
Zoom/Meet        - Webinar hosting
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **AWS Account** for S3 (optional, for image uploads)
- **Gmail Account** for SMTP (optional, for emails)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd global-academy-of-embryology
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see [Environment Setup](#environment-setup))

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

🎉 **You're all set!**

---

## 🔐 Environment Setup

### Required Environment Variables

Create a `.env.local` file with the following variables:

```bash
# ==========================================
# Database Configuration
# ==========================================
MONGODB_URI=mongodb+srv:*************************

# ==========================================
# JWT Authentication
# ==========================================
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=2h
COOKIE_NAME=token
COOKIE_MAX_AGE=7200
BCRYPT_SALT_ROUNDS=12

# ==========================================
# Password Reset
# ==========================================
RESET_TOKEN_EXPIRY_MIN=60

# ==========================================
# Email Configuration (Gmail SMTP)
# ==========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# ==========================================
# AWS S3 Configuration (Optional)
# ==========================================
AWS_ACCESS=your-aws-access-key-id
AWS_SECRET=your-aws-secret-access-key
AWS_REGION=us-east-2
AWS_BUCKET=your-bucket-name

# ==========================================
# Application Configuration
# ==========================================
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### How to Get Credentials

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

#### Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password

#### AWS S3 (Optional)
1. Go to [AWS Console](https://aws.amazon.com/console/)
2. Create an S3 bucket
3. Go to IAM → Create user with S3 permissions
4. Generate access keys
5. Copy Access Key ID and Secret Access Key

---

## 📂 Project Structure

```
global-academy-of-embryology/
│
├── app/                          # Next.js App Router
│   ├── api/                      # Backend API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── register/         # POST /api/auth/register
│   │   │   ├── login/            # POST /api/auth/login
│   │   │   ├── me/               # GET /api/auth/me
│   │   │   ├── update-profile/   # PUT /api/auth/update-profile
│   │   │   ├── change-password/  # POST /api/auth/change-password
│   │   │   ├── forgot/           # POST /api/auth/forgot
│   │   │   └── reset/            # POST /api/auth/reset
│   │   ├── webinars/             # Webinar management
│   │   │   ├── route.ts          # GET/POST /api/webinars
│   │   │   ├── upcoming/         # GET /api/webinars/upcoming
│   │   │   ├── past/             # GET /api/webinars/past
│   │   │   └── [id]/             # GET/PUT/DELETE /api/webinars/:id
│   │   ├── webinar-register/     # Webinar registration
│   │   │   └── [id]/             # POST /api/webinar-register/:id
│   │   ├── faculty/              # Faculty management
│   │   │   └── route.ts          # GET/POST /api/faculty
│   │   └── upload/               # File upload
│   │       └── route.ts          # POST /api/upload
│   │
│   ├── models/                   # MongoDB Models
│   │   ├── User.ts               # User schema
│   │   ├── Webinar.ts            # Webinar schema
│   │   └── Faculty.ts            # Faculty schema
│   │
│   ├── components/               # Reusable Components
│   │   ├── Navbar.tsx
│   │   └── AnimatedLogoLoader.tsx
│   │
│   ├── webinars/                 # Webinar Pages
│   │   ├── page.tsx              # Webinars listing
│   │   └── [id]/page.tsx         # Webinar details
│   │
│   ├── admin/                    # Admin Pages
│   │   └── faculty/
│   │       └── new/page.tsx
│   │
│   ├── profile/page.tsx          # User profile
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Registration
│   └── page.tsx                  # Homepage
│
├── lib/                          # Utility Functions
│   ├── mongodb.ts                # DB connection
│   ├── auth.ts                   # JWT helpers
│   ├── s3.ts                     # AWS S3 upload
│   └── validation.ts             # Validators
│
├── public/                       # Static Assets
├── .env.local                    # Environment variables
├── .gitignore                    # Git ignore
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── README.md                     # This file
└── Documentation.md              # Detailed docs
```

---

## 📡 API Documentation

### Quick Reference

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/update-profile` | Update profile | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/forgot` | Request reset | No |
| POST | `/api/auth/reset` | Reset password | No |
| GET | `/api/webinars` | Get all webinars | No |
| GET | `/api/webinars/upcoming` | Get upcoming | No |
| GET | `/api/webinars/past` | Get past | No |
| GET | `/api/webinars/:id` | Get single | No |
| POST | `/api/webinars` | Create webinar | Admin |
| PUT | `/api/webinars/:id` | Update webinar | Admin |
| DELETE | `/api/webinars/:id` | Delete webinar | Admin |
| POST | `/api/webinar-register/:id` | Register | Yes |
| GET | `/api/faculty` | Get faculty | No |
| POST | `/api/faculty` | Add faculty | Admin |
| POST | `/api/upload` | Upload image | Admin |

### Example: Register User

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "password": "SecurePass123",
    "dob": "1990-05-15",
    "qualification": "PhD",
    "designation": "Senior Embryologist",
    "clinicName": "ABC IVF Center",
    "address": "123 Medical St",
    "workExp": "10"
  }'
```

**Response**:
```json
{
  "user": {
    "_id": "64f8a...",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "mobile": "9876543210"
  }
}
```

For detailed API documentation, see [Documentation.md](./Documentation.md)

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Deploy to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Add environment variables from `.env.local`
- Click "Deploy"

3. **Configure Custom Domain** (Optional)

- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

### Deploy to Other Platforms

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### AWS / DigitalOcean
```bash
# Build the app
npm run build

# Start production server
npm start
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Manual Testing Checklist

- [ ] User registration (email + mobile)
- [ ] Login with email
- [ ] Login with mobile
- [ ] Profile update
- [ ] Password change
- [ ] Forgot password flow
- [ ] Webinar registration
- [ ] View countdown timer
- [ ] Join live webinar
- [ ] Watch past recording
- [ ] Admin: Create webinar
- [ ] Admin: Upload image
- [ ] Admin: Add faculty

---

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Code Style

This project follows:

- **ESLint** for code quality
- **Prettier** for formatting
- **TypeScript** for type safety
- **Conventional Commits** for commit messages

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'feat: Add AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

**Proprietary License** - All Rights Reserved

© 2024 Global Academy of Embryology. This software and associated documentation files are proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Support

### Get Help

- 📧 **Email**: abhiramgaddam53@gmail.com
- 📚 **Documentation**: [Documentation.md](./Documentation.md)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-repo/issues)

### Frequently Asked Questions

**Q: How do I reset my password?**  
A: Click "Forgot Password" on the login page and follow the instructions.

**Q: Can I login with my mobile number?**  
A: Yes! You can use either your email or mobile number to login.

**Q: How do I join a live webinar?**  
A: Register for the webinar first. When it goes live, a "Join Live" button will appear on the webinar details page.

**Q: Where are my certificates stored?**  
A: Certificate functionality is coming soon. You'll be able to view and download them from your profile.

---

## 🗺️ Roadmap

### Version 1.1 (Q2 2024)
- [ ] Email notifications
- [ ] Certificate generation
- [ ] Payment gateway integration
- [ ] Advanced search filters

### Version 2.0 (Q3 2024)
- [ ] Mobile app (React Native)
- [ ] Live chat support
- [ ] Discussion forums
- [ ] Analytics dashboard

### Version 3.0 (Q4 2024)
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Advanced reporting

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Hosting platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [GSAP](https://greensock.com/gsap/) - Animation library

---

## 📊 Project Stats

![GitHub last commit](https://img.shields.io/github/last-commit/your-repo/gae)
![GitHub issues](https://img.shields.io/github/issues/your-repo/gae)
![GitHub stars](https://img.shields.io/github/stars/your-repo/gae)
![GitHub forks](https://img.shields.io/github/forks/your-repo/gae)

---

<div align="center">

**Built with ❤️ by the GAE Development Team**

[Website](https://gae.com) • [Documentation](./Documentation.md) • [Support](mailto:abhiramgaddam53@gmail.com)

</div>
