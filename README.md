# Global Academy of Embryology (GAE) - Platform Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Authentication Flow](#authentication-flow)
6. [Environment Variables](#environment-variables)
7. [External Integrations](#external-integrations)
8. [Installation & Setup](#installation--setup)

---

## 🎯 Project Overview

Global Academy of Embryology is a professional learning platform for embryology professionals featuring:
- User registration and authentication
- Webinar management (upcoming/past with external platform integration)
- Faculty/Team management
- User profile management
- Admin dashboard
- Certificate management (planned)

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **Icons**: Lucide React
- **Image Handling**: Next/Image

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer (SMTP)

### External Services
- **File Storage**: AWS S3
- **Email**: Gmail SMTP
- **Webinar Hosting**: External platforms (Zoom, Google Meet, etc.)

---

## 📊 Database Models

### 1. User Model
**File**: `/app/models/User.ts`

```typescript
interface IUser {
  // Personal Information
  name: string;              // Required
  email: string;             // Required, Unique, Lowercase
  mobile: string;            // Required, Unique
  dob: Date;                 // Date of Birth
  
  // Authentication
  password: string;          // Hashed password
  role: "user" | "admin";    // Default: "user"
  
  // Professional Information
  qualification: string;
  designation: string;
  clinicName: string;
  address: string;
  workExp: number;          // Years of experience
  
  // Password Reset
  resetToken?: string;
  resetExpiresAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

**Validations**:
- Email: Must be valid email format, unique
- Mobile: 10 digits starting with 6-9 (Indian format), unique
- Password: Minimum 8 characters, must contain letters and numbers
- All personal and professional fields are required during registration

**Methods**:
- `comparePassword(password: string): Promise<boolean>` - Compare plain text with hashed password
- Pre-save hook: Automatically hashes password before saving

---

### 2. Webinar Model
**File**: `/app/models/Webinar.ts`

```typescript
interface IWebinar {
  // Basic Information
  title: string;              // Required
  description: string;        // Required
  dateTime: Date;            // Required
  duration?: string;         // Default: "1 hour"
  
  // Speakers
  mentors: string[];         // Array of speaker names
  
  // Media
  imageUrl?: string;         // Poster/thumbnail image
  
  // External Links
  webinarLink?: string;      // Live webinar platform URL
  recordedLink?: string;     // Recording URL (for past webinars)
  registrationLink?: string; // External registration platform
  
  // Status
  isStarted: boolean;        // Default: false
  isPast: boolean;           // Default: false
  
  // Registration Tracking
  registeredUsers: ObjectId[]; // Array of User IDs
  registeredCount: number;     // Auto-calculated
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

**Hooks**:
- Pre-save: Auto-calculates `registeredCount` from `registeredUsers.length`

---

### 3. Faculty Model
**File**: `/app/models/Faculty.ts` (Planned)

```typescript
interface IFaculty {
  // Basic Information
  name: string;              // Required
  email: string;             // Required, Unique
  designation: string;       // Required
  specialization: string;    // Required
  
  // Professional Details
  experience: string;        // e.g., "10+ Years"
  education: string;         // Qualifications
  bio: string;              // Biography
  
  // Media
  image: string;            // Profile picture URL
  
  // Achievements
  achievements: string[];   // Array of achievements
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints

### Authentication APIs

#### 1. Register User
**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "name": "Dr. John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "SecurePass123",
  "dob": "1990-05-15",
  "qualification": "PhD in Embryology",
  "designation": "Senior Embryologist",
  "clinicName": "ABC IVF Center",
  "address": "123 Medical Street, City",
  "workExp": "10"
}
```

**Success Response** (201):
```json
{
  "user": {
    "_id": "64f8a...",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "dob": "1990-05-15T00:00:00.000Z",
    "qualification": "PhD in Embryology",
    "designation": "Senior Embryologist",
    "clinicName": "ABC IVF Center",
    "address": "123 Medical Street, City",
    "workExp": 10
  }
}
```

**Error Responses**:
- `400`: Missing required fields
- `400`: Invalid email format
- `400`: Invalid mobile number
- `400`: Weak password
- `409`: Email already exists
- `409`: Mobile already exists
- `500`: Server error

---

#### 2. Login User
**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "identifier": "john@example.com",  // Email OR Mobile
  "password": "SecurePass123"
}
```

**Success Response** (200):
```json
{
  "ok": true,
  "user": {
    "_id": "64f8a...",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "user"
  }
}
```

**Headers Set**:
- `Set-Cookie`: JWT token in HTTP-only cookie

**Error Responses**:
- `400`: Missing identifier or password
- `400`: Invalid email/mobile format
- `401`: Invalid credentials
- `500`: Server error

---

#### 3. Get Current User
**Endpoint**: `GET /api/auth/me`

**Headers Required**:
- `Cookie`: Must contain valid JWT token

**Success Response** (200):
```json
{
  "user": {
    "_id": "64f8a...",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "user",
    "dob": "1990-05-15T00:00:00.000Z",
    "qualification": "PhD in Embryology",
    "designation": "Senior Embryologist",
    "clinicName": "ABC IVF Center",
    "address": "123 Medical Street, City",
    "workExp": 10,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses**:
- `401`: Not authenticated
- `500`: Server error

---

#### 4. Update Profile
**Endpoint**: `PUT /api/auth/update-profile`

**Headers Required**:
- `Cookie`: Valid JWT token

**Request Body**:
```json
{
  "name": "Dr. John Doe",
  "dob": "1990-05-15",
  "mobile": "9876543210",
  "qualification": "PhD in Embryology",
  "designation": "Senior Embryologist",
  "clinicName": "ABC IVF Center",
  "address": "123 Medical Street, City",
  "workExp": "10"
}
```

**Success Response** (200):
```json
{
  "user": {
    // Updated user object
  }
}
```

**Error Responses**:
- `401`: Not authenticated
- `400`: Validation errors
- `500`: Server error

---

#### 5. Forgot Password
**Endpoint**: `POST /api/auth/forgot`

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Success Response** (200):
```json
{
  "ok": true,
  "message": "If the email exists, a reset link has been sent",
  "tokenSent": true
}
```

**Process**:
1. Generates random reset token (48 character hex)
2. Sets expiry time (60 minutes by default)
3. Saves token to user document
4. Sends email with reset link (to be implemented)

**Error Responses**:
- `400`: Invalid email format
- `500`: Server error

---

#### 6. Reset Password
**Endpoint**: `POST /api/auth/reset`

**Request Body**:
```json
{
  "email": "john@example.com",
  "token": "a1b2c3d4e5f6...",
  "newPassword": "NewSecurePass123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Error Responses**:
- `400`: Validation errors
- `400`: Invalid or expired token
- `500`: Server error

---

### Webinar APIs

#### 7. Get All Webinars
**Endpoint**: `GET /api/webinars`

**Success Response** (200):
```json
{
  "webinars": [
    {
      "_id": "64f8a...",
      "title": "Advanced IVF Techniques",
      "description": "Learn about the latest...",
      "dateTime": "2024-06-15T14:00:00.000Z",
      "duration": "2 hours",
      "mentors": ["Dr. Jane Smith", "Dr. Robert Lee"],
      "imageUrl": "https://...",
      "webinarLink": "https://zoom.us/...",
      "recordedLink": "",
      "registrationLink": "https://eventbrite.com/...",
      "isStarted": false,
      "isPast": false,
      "registeredCount": 45,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### 8. Get Upcoming Webinars
**Endpoint**: `GET /api/webinars/upcoming`

**Success Response** (200):
```json
{
  "webinars": [
    // Array of upcoming webinar objects
    // Sorted by dateTime ascending
  ]
}
```

**Filters**:
- `dateTime >= current date`
- `isPast = false`

---

#### 9. Get Past Webinars
**Endpoint**: `GET /api/webinars/past`

**Success Response** (200):
```json
{
  "webinars": [
    // Array of past webinar objects
    // Sorted by dateTime descending
  ]
}
```

**Filters**:
- `isPast = true`

---

#### 10. Get Single Webinar
**Endpoint**: `GET /api/webinars/[id]`

**Success Response** (200):
```json
{
  "webinar": {
    "_id": "64f8a...",
    "title": "Advanced IVF Techniques",
    // ... all webinar fields
    "isRegistered": true  // If user is logged in and registered
  }
}
```

**Error Responses**:
- `404`: Webinar not found
- `500`: Server error

---

#### 11. Create Webinar (Admin Only)
**Endpoint**: `POST /api/webinars`

**Headers Required**:
- `Cookie`: Valid JWT token (admin role)

**Request Body**:
```json
{
  "title": "Advanced IVF Techniques",
  "description": "Comprehensive workshop on...",
  "dateTime": "2024-06-15T14:00:00.000Z",
  "duration": "2 hours",
  "mentors": ["Dr. Jane Smith", "Dr. Robert Lee"],
  "imageUrl": "https://s3.amazonaws.com/...",
  "webinarLink": "https://zoom.us/j/123456",
  "registrationLink": "https://eventbrite.com/e/123"
}
```

**Success Response** (201):
```json
{
  "webinar": {
    // Created webinar object
  }
}
```

**Error Responses**:
- `401`: Not authenticated
- `403`: Admin access required
- `400`: Missing required fields
- `500`: Server error

---

#### 12. Update Webinar (Admin Only)
**Endpoint**: `PUT /api/webinars/[id]`

**Headers Required**:
- `Cookie`: Valid JWT token (admin role)

**Request Body**: Same as Create Webinar

**Success Response** (200):
```json
{
  "webinar": {
    // Updated webinar object
  }
}
```

**Error Responses**:
- `401`: Not authenticated
- `403`: Admin access required
- `404`: Webinar not found
- `500`: Server error

---

#### 13. Delete Webinar (Admin Only)
**Endpoint**: `DELETE /api/webinars/[id]`

**Headers Required**:
- `Cookie`: Valid JWT token (admin role)

**Success Response** (200):
```json
{
  "message": "Webinar deleted successfully"
}
```

**Error Responses**:
- `401`: Not authenticated
- `403`: Admin access required
- `404`: Webinar not found
- `500`: Server error

---

#### 14. Register for Webinar
**Endpoint**: `POST /api/webinars-register/[id]`

**Headers Required**:
- `Cookie`: Valid JWT token

**Success Response** (200):
```json
{
  "success": true,
  "message": "Successfully registered for webinar"
}
```

**Process**:
1. Verifies user authentication
2. Checks if already registered
3. Validates webinar is not past
4. Adds user ID to `registeredUsers` array
5. Auto-increments `registeredCount`

**Error Responses**:
- `401`: Not authenticated
- `400`: Already registered
- `400`: Cannot register for past webinars
- `404`: Webinar not found
- `500`: Server error

---

### Faculty APIs

#### 15. Get All Faculty
**Endpoint**: `GET /api/faculty`

**Success Response** (200):
```json
{
  "message": "Fetch doctors from DB here"
}
```
*(Placeholder - Implementation pending)*

---

#### 16. Create Faculty (Admin Only)
**Endpoint**: `POST /api/faculty`

**Request Body**:
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "designation": "Senior Embryologist",
  "specialization": "IVF, Andrology",
  "experience": "15+ Years",
  "education": "PhD, MSc",
  "bio": "Dr. Jane has extensive experience...",
  "image": "/placeholder.jpg",
  "achievements": [
    "Best Embryologist Award 2023",
    "Published 50+ research papers"
  ]
}
```

**Success Response** (201):
```json
{
  "message": "Admin will add doctor here"
}
```
*(Placeholder - Implementation pending)*

---

### File Upload API

#### 17. Upload Image (Admin Only)
**Endpoint**: `POST /api/upload`

**Headers Required**:
- `Cookie`: Valid JWT token (admin role)
- `Content-Type`: multipart/form-data

**Request Body** (FormData):
```javascript
const formData = new FormData();
formData.append('file', imageFile);
```

**File Validations**:
- **Allowed types**: JPEG, PNG, WebP
- **Max size**: 5MB
- **Uploaded to**: AWS S3 bucket

**Success Response** (200):
```json
{
  "url": "https://gae-photos-storage.s3.us-east-2.amazonaws.com/Webinar-photos/abc123.jpg"
}
```

**Error Responses**:
- `401`: Not authenticated
- `403`: Admin access required
- `400`: No file provided
- `400`: Invalid file type
- `400`: File too large
- `500`: Upload failed

---

## 🔐 Authentication Flow

### User Registration Flow
```
1. User submits registration form
2. API validates all required fields
3. API checks email and mobile uniqueness
4. Password is hashed using bcryptjs
5. User document created in MongoDB
6. Success response sent (no auto-login)
```

### Login Flow
```
1. User submits email/mobile + password
2. API finds user by email OR mobile
3. Password verified using bcrypt.compare()
4. JWT token generated with user data
5. Token set in HTTP-only cookie
6. User data returned in response
```

### Protected Routes
```
1. Frontend makes request to protected API
2. API extracts JWT from cookie
3. JWT verified using secret key
4. User ID extracted from token
5. User fetched from database
6. Request processed if valid
```

---

## 🌍 Environment Variables

### Required Variables

```bash
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/GAE?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=60m
COOKIE_NAME=token
COOKIE_MAX_AGE=3600
BCRYPT_SALT_ROUNDS=12

# Password Reset
RESET_TOKEN_EXPIRY_MIN=60

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AWS S3
AWS_ACCESS=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET=your-aws-secret-key
AWS_REGION=us-east-2
AWS_BUCKET=gae-photos-storage

# App Config
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🔗 External Integrations

### 1. AWS S3 (File Storage)
**Purpose**: Store webinar images and faculty photos

**Configuration**:
- **Region**: us-east-2
- **Bucket**: gae-photos-storage
- **Folder**: Webinar-photos/

**Upload Process**:
```typescript
1. File received via multipart/form-data
2. File validated (type, size)
3. Converted to Buffer
4. Uploaded to S3 using PutObjectCommand
5. Public URL returned
```

---

### 2. Gmail SMTP (Email)
**Purpose**: Password reset emails, notifications

**Configuration**:
- **Host**: smtp.gmail.com
- **Port**: 587
- **Secure**: STARTTLS

**Email Types**:
- Password reset emails
- Registration confirmation (planned)
- Webinar reminders (planned)

---

### 3. External Webinar Platforms
**Supported**: Zoom, Google Meet, Microsoft Teams, Custom links

**Integration Points**:
- `webinarLink`: Live session URL
- `recordedLink`: Recording URL
- `registrationLink`: External registration page

**User Flow**:
```
1. User views webinar on GAE platform
2. User clicks "Register Now" → External registration
3. User clicks "Join Live" → External platform
4. User clicks "Watch Recording" → External video
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- AWS S3 bucket
- Gmail account (for SMTP)

### Installation Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd global-academy-of-embryology

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Configure environment variables
# Edit .env.local with your credentials

# 5. Run development server
npm run dev

# 6. Build for production
npm run build

# 7. Start production server
npm start
```

### Required npm Packages

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "cookie": "^0.6.0",
    "nodemailer": "^6.9.0",
    "@aws-sdk/client-s3": "^3.0.0",
    "gsap": "^3.12.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cookie": "^0.6.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 🗂 Project Structure

```
global-academy-of-embryology/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── me/route.ts
│   │   │   ├── forgot/route.ts
│   │   │   ├── reset/route.ts
│   │   │   └── update-profile/route.ts
│   │   ├── webinars/
│   │   │   ├── route.ts
│   │   │   ├── upcoming/route.ts
│   │   │   ├── past/route.ts
│   │   │   └── [id]/route.ts
│   │   ├── webinars-register/
│   │   │   └── [id]/route.ts
│   │   ├── faculty/route.ts
│   │   └── upload/route.ts
│   ├── models/                 # Mongoose Models
│   │   ├── User.ts
│   │   ├── Webinar.ts
│   │   └── Faculty.ts
│   ├── components/             # React Components
│   │   ├── Navbar.tsx
│   │   └── AnimatedLogoLoader.tsx
│   ├── profile/page.tsx        # User Profile
│   ├── webinars/               # Webinar Pages
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── admin/                  # Admin Dashboard
│   │   └── faculty/
│   │       └── new/page.tsx
│   └── login/page.tsx          # Auth Pages
├── lib/                        # Utilities
│   ├── mongodb.ts              # DB Connection
│   ├── auth.ts                 # Auth Helpers
│   ├── s3.ts                   # S3 Upload
│   └── validation.ts           # Input Validation
├── .env.local                  # Environment Variables
├── next.config.js              # Next.js Config
├── tailwind.config.ts          # Tailwind Config
└── package.json                # Dependencies
```

---

## 🚀 Key Features

### ✅ Implemented
- User registration with comprehensive validation
- Login with email OR mobile number
- JWT-based authentication with HTTP-only cookies
- Profile management
- Webinar listing (upcoming/past)
- Webinar details with countdown timer
- External platform integration for webinars
- Image upload to AWS S3
- Password reset flow
- Admin role checking

### 🔄 In Progress
- Faculty management CRUD
- Email notifications
- Certificate generation

### 📋 Planned
- Payment gateway integration
- Course management
- Live chat support
- Mobile app

---

## 📞 Support

For issues or questions:
- **Email**: support@gae.com
- **Documentation**: This README
- **Database**: MongoDB Atlas Dashboard

---

**Last Updated**: January 2024
**Version**: 1.0.0
