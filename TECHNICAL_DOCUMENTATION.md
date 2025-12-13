# Global Academy of Embryology - Technical Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [API Endpoints](#api-endpoints)
7. [Frontend Structure](#frontend-structure)
8. [Security Considerations](#security-considerations)
9. [Development Setup](#development-setup)
10. [Deployment Notes](#deployment-notes)

---

## Project Overview

**Global Academy of Embryology** is a full-stack Next.js application designed for a medical education platform focused on embryology training. It provides:

- User registration & authentication (email/mobile-based login)
- Secure password reset via email tokens
- Faculty/instructor profiles with detailed bios
- Dashboard for authenticated users
- Content pages: About, Faculty, Gallery, Webinars
- Role-based access control (user/admin roles)

The platform is built with modern web technologies, emphasizing security, scalability, and type safety.

---

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FULL-STACK APP                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │   Frontend (React)   │         │   API Routes         │     │
│  │  - Login/Register    │◄───────►│   (Node.js Runtime)  │     │
│  │  - Dashboard         │         │  - Auth endpoints    │     │
│  │  - Faculty Pages     │         │  - Faculty CRUD      │     │
│  │  - User Profile      │         │  - User management   │     │
│  │  - Static Pages      │         │                      │     │
│  └──────────────────────┘         └──────────────────────┘     │
│         ▲                                    ▲                   │
│         │ HTTP(S)                           │                   │
│         │                                   │                   │
│  ┌──────┴───────────────────────────────────┴──────┐            │
│  │         Middleware (CORS, Auth)                 │            │
│  └──────────────────────────────────────────────────┘            │
│                              ▼                                    │
│              ┌───────────────────────────┐                      │
│              │    MongoDB Atlas          │                      │
│              │  - Users Collection       │                      │
│              │  - ResetTokens Collection │                      │
│              │  - Faculty Collection(*)  │                      │
│              └───────────────────────────┘                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

(*) Faculty data currently static but prepared for DB integration
```

### Request Flow

```
1. Client Request → Middleware (CORS validation)
2. → Next.js Router (API or Page)
3. → Authentication (JWT verification if needed)
4. → MongoDB Connection (via Mongoose)
5. → Business Logic
6. → Database Operation
7. → Response (JSON or HTML)
8. → Set HTTP-Only Cookie (if auth)
9. → Client receives response
```

---

## Tech Stack

### Frontend

- **React 19.2.1** - UI library with latest hooks & features
- **Next.js 16.0.8** - Full-stack framework with App Router
- **Tailwind CSS 4** - Utility-first styling
- **GSAP 3.14.1** - Animation library for smooth transitions
- **Lucide React 0.560** - Icon library (not yet implemented in pages)

### Backend

- **Node.js** (via Next.js API Routes)
- **MongoDB** - NoSQL database for document storage
- **Mongoose 9.0.1** - ODM for schema validation & model definition

### Authentication & Security

- **jsonwebtoken 9.0.3** - JWT token generation & verification
- **bcryptjs 3.0.3** - Password hashing with salt rounds (12 by default)
- **nodemailer 7.0.11** - Email delivery for password reset
- **cookie 1.1.1** - HTTP-Only cookie serialization

### Development

- **TypeScript 5** - Full type safety
- **ESLint 9** - Code linting
- **PostCSS 4** - CSS processing

---

## Database Schema

### User Model

**File:** `app/models/User.ts`

```typescript
interface IUser extends Document {
  // Personal Information
  name: string; // Full name (required)
  dob: string; // Date of birth (YYYY-MM-DD)
  email: string; // Unique, lowercase, trimmed
  mobile: string; // Indian format: 10 digits (6-9 prefix)

  // Professional Information
  qualification: string; // e.g., "PhD", "MSc", "MBBS"
  designation: string; // e.g., "Senior Embryologist"
  clinicName: string; // Associated clinic/institution
  address: string; // Full address
  workExp: string; // Work experience description

  // Security & Metadata
  password: string; // Bcrypt hashed (never sent to client)
  role: "user" | "admin"; // Access control (default: "user")
  createdAt: Date; // Timestamp (auto-set)

  // Password Reset
  passwordResetToken?: string; // Plaintext token (never stored - use ResetToken model)
  passwordResetExpires?: Date; // Token expiration

  // Methods
  comparePassword(candidate: string): Promise<boolean>; // Bcrypt comparison
}
```

**Indexes:**

- `email`: Unique index (prevents duplicate registrations)
- `mobile`: Auto-indexed (used in login lookup)

**Pre-Save Hook:**

```typescript
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
  const salt = await bcrypt.genSalt(rounds);
  this.password = await bcrypt.hash(this.password, salt);
});
```

- Automatically hashes password before saving
- Skips hashing if password wasn't modified (e.g., on profile update)
- Uses configurable salt rounds (default: 12)

---

### ResetToken Model

**File:** `app/models/ResetToken.ts`

```typescript
interface IResetToken {
  userId: ObjectId; // Reference to User._id (Foreign Key)
  tokenHash: string; // SHA-256 hash of reset token (never store plaintext)
  expiresAt: Date; // Expiration timestamp (1 hour from creation)
}
```

**Design Pattern:**

- Uses **token hashing** for security: if DB is breached, attacker can't forge reset links
- `userId` reference allows linking multiple tokens per user (old ones deleted when new request made)
- TTL index (handled via `expiresAt` query) ensures tokens expire after 1 hour

---

## Authentication Flow

### 1. Registration Flow (`POST /api/auth/register`)

```
┌─────────────────────────────────────────────────────────────────┐
│                     REGISTRATION ENDPOINT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Input: {                                                        │
│    name, dob, qualification, designation, clinicName,          │
│    address, workExp, mobile, email, password                   │
│  }                                                               │
│         │                                                        │
│         ▼                                                        │
│  Step 1: Validate All Fields Present                           │
│         ├─ Check for empty strings                             │
│         ├─ Check for null/undefined                            │
│         └─ Return 400 if missing                               │
│         │                                                        │
│         ▼                                                        │
│  Step 2: Format Validation                                     │
│         ├─ Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/                │
│         ├─ Mobile: /^[6-9]\d{9}$/ (Indian format)              │
│         ├─ Password: min 8 chars, [A-Za-z], [\d], [special]   │
│         ├─ DOB: Valid ISO date format                          │
│         └─ Return 400 if validation fails                      │
│         │                                                        │
│         ▼                                                        │
│  Step 3: Duplicate Check                                       │
│         ├─ Query: User.findOne({ email })                     │
│         ├─ Query: User.findOne({ mobile })                    │
│         ├─ Return 409 if either exists                        │
│         └─ Prevent enumeration attacks: specify what's taken  │
│         │                                                        │
│         ▼                                                        │
│  Step 4: Create & Hash User                                    │
│         ├─ new User({ ...all fields })                         │
│         ├─ Trigger pre-save hook:                              │
│         │  - Generate salt (12 rounds)                         │
│         │  - Hash password with salt                           │
│         ├─ Save to MongoDB                                     │
│         └─ Return 201 with user data (no password)             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Validation Details:**

| Field    | Rule                        | Reason                                         |
| -------- | --------------------------- | ---------------------------------------------- |
| Email    | RFC standard format         | Prevent invalid entries, enable password reset |
| Mobile   | 10 digits, starts 6-9       | India-specific format (TRAI standards)         |
| Password | 8+ chars, letters + numbers | Prevent weak passwords                         |
| DOB      | Valid ISO date              | Ensure proper age tracking (future feature)    |

**Response:**

```json
{
  "ok": true,
  "user": {
    "_id": "67...",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "mobile": "9123456789",
    "role": "user"
  }
}
```

---

### 2. Login Flow (`POST /api/auth/login`)

```
┌────────────────────────────────────────────────────────────────┐
│                        LOGIN ENDPOINT                           │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input: { identifier, password }                              │
│  (identifier = email OR mobile)                               │
│         │                                                       │
│         ▼                                                       │
│  Step 1: Validate Inputs                                      │
│         ├─ Check both fields present                          │
│         └─ Return 400 if missing                              │
│         │                                                       │
│         ▼                                                       │
│  Step 2: Identify Login Type                                  │
│         ├─ Test: isValidEmail(identifier)?                    │
│         ├─ Test: isValidMobile(identifier)?                   │
│         ├─ Build query: { email } OR { mobile }               │
│         └─ Return 400 if neither format matches               │
│         │                                                       │
│         ▼                                                       │
│  Step 3: Find User                                            │
│         ├─ Query: User.findOne(query)                         │
│         ├─ NOT found? → Return 401                           │
│         │             (Never reveal if email/mobile exists)    │
│         └─ Found: Continue                                     │
│         │                                                       │
│         ▼                                                       │
│  Step 4: Verify Password                                      │
│         ├─ Call: user.comparePassword(password)               │
│         │        (Uses bcrypt.compare internally)             │
│         ├─ False? → Return 401                               │
│         └─ True: Continue                                      │
│         │                                                       │
│         ▼                                                       │
│  Step 5: Generate JWT                                         │
│         ├─ Payload: { sub: user._id, email, mobile, role }   │
│         ├─ Sign: jwt.sign(payload, JWT_SECRET, {             │
│         │         expiresIn: JWT_EXPIRES_IN (15m default)    │
│         │       })                                             │
│         └─ Result: token string                               │
│         │                                                       │
│         ▼                                                       │
│  Step 6: Serialize HTTP-Only Cookie                           │
│         ├─ cookie.serialize(COOKIE_NAME, token, {           │
│         │   httpOnly: true,  // JS can't access             │
│         │   secure: isProd,  // HTTPS only in prod           │
│         │   sameSite: "lax", // CSRF protection              │
│         │   maxAge: 900s     // 15 minutes                   │
│         │ })                                                   │
│         ├─ Set: response.headers.set("Set-Cookie", ...)      │
│         └─ Token sent via cookie (not body)                   │
│         │                                                       │
│         ▼                                                       │
│  Return 200 + Cookie:                                          │
│  {                                                              │
│    "ok": true,                                                 │
│    "user": { _id, name, email, mobile, role }               │
│  }                                                              │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

**Key Security Features:**

1. **User Enumeration Protection**: Returns 401 for both "user not found" and "wrong password"
2. **Bcrypt Comparison**: `comparePassword()` method uses safe `bcrypt.compare()` (timing attack resistant)
3. **HTTP-Only Cookie**: Prevents XSS attacks from stealing auth token
4. **Short Expiration**: 15 minutes default (configurable via `JWT_EXPIRES_IN`)
5. **Flexible Identifier**: Accepts email OR mobile (Indian users may prefer mobile)

---

### 3. Forgot Password Flow (`POST /api/auth/forgot-password`)

```
┌──────────────────────────────────────────────────────────────────┐
│                  FORGOT PASSWORD ENDPOINT                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Input: { email }                                               │
│         │                                                        │
│         ▼                                                        │
│  Step 1: Validate Email                                        │
│         ├─ Check email provided                                │
│         └─ Return 400 if missing                               │
│         │                                                        │
│         ▼                                                        │
│  Step 2: Find User (with safety)                               │
│         ├─ Query: User.findOne({ email })                     │
│         ├─ NOT found? → Return 200 anyway!                   │
│         │             (Prevent email enumeration)              │
│         └─ Found: Continue                                     │
│         │                                                        │
│         ▼                                                        │
│  Step 3: Generate Reset Token                                  │
│         ├─ crypto.randomBytes(32) → 64 char hex string       │
│         │  (Example: "3f4a9c2b1e8d5f7a...")                 │
│         ├─ This token is sent to user's email                │
│         └─ User includes it in reset link                     │
│         │                                                        │
│         ▼                                                        │
│  Step 4: Hash Token for Storage                               │
│         ├─ tokenHash = SHA-256(resetToken)                    │
│         ├─ Store ONLY hash in DB (not plaintext)             │
│         │  (If DB breached, token can't be forged)            │
│         └─ Plaintext token only sent via email (1x)           │
│         │                                                        │
│         ▼                                                        │
│  Step 5: Delete Old Tokens                                     │
│         ├─ ResetToken.deleteMany({ userId: user._id })       │
│         └─ Ensure user has only 1 active reset token         │
│         │                                                        │
│         ▼                                                        │
│  Step 6: Create Reset Token Record                            │
│         ├─ ResetToken.create({                                │
│         │   userId: user._id,                                 │
│         │   tokenHash: hash,                                  │
│         │   expiresAt: Date.now() + 1 hour                   │
│         │ })                                                   │
│         └─ 1-hour expiration window                            │
│         │                                                        │
│         ▼                                                        │
│  Step 7: Send Email                                            │
│         ├─ Nodemailer via SMTP config:                        │
│         │  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS      │
│         ├─ Reset URL: {FRONTEND_URL}/reset-password?token=... │
│         ├─ Includes clickable link + plain text               │
│         └─ Errors logged but not thrown (UX improvement)      │
│         │                                                        │
│         ▼                                                        │
│  Return 200 (always):                                          │
│  { "ok": true }                                                │
│                                                                   │
│  IMPORTANT:                                                      │
│  ✓ Always return 200 (prevents email enumeration)              │
│  ✓ Email may fail silently (SMTP issues)                       │
│  ✓ User must check spam folder                                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Email Security:**

- Nodemailer supports multiple SMTP providers (Gmail, SendGrid, custom SMTP)
- Credentials stored in `.env` (never committed)
- Email content supports both HTML & plain text fallback

---

### 4. Password Reset Flow (`POST /api/auth/reset-password`)

```
┌──────────────────────────────────────────────────────────────────┐
│                   RESET PASSWORD ENDPOINT                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Input: { token, newPassword }                                 │
│  (token = plaintext token from email link)                    │
│         │                                                        │
│         ▼                                                        │
│  Step 1: Validate Inputs                                       │
│         ├─ Check both fields present                           │
│         └─ Return 400 if missing                               │
│         │                                                        │
│         ▼                                                        │
│  Step 2: Hash Token for DB Lookup                              │
│         ├─ tokenHash = SHA-256(token)                          │
│         │  (Match against stored hash)                         │
│         └─ Continue                                             │
│         │                                                        │
│         ▼                                                        │
│  Step 3: Verify Token Exists & Not Expired                     │
│         ├─ Query: ResetToken.findOne({                         │
│         │   tokenHash,                                         │
│         │   expiresAt: { $gt: Date.now() }  ◄─ Not expired    │
│         │ })                                                    │
│         ├─ Not found? → Return 400                            │
│         │             "Invalid or expired reset token"         │
│         └─ Found: Continue                                     │
│         │                                                        │
│         ▼                                                        │
│  Step 4: Find Associated User                                  │
│         ├─ User = User.findById(resetRecord.userId)            │
│         ├─ Not found? → Return 404 (account deleted?)         │
│         └─ Found: Continue                                     │
│         │                                                        │
│         ▼                                                        │
│  Step 5: Update Password                                       │
│         ├─ user.password = newPassword                         │
│         ├─ user.save()  ◄─ Triggers pre-save hook            │
│         │               (Password auto-hashed with bcrypt)     │
│         └─ New password now protected                           │
│         │                                                        │
│         ▼                                                        │
│  Step 6: Invalidate All Reset Tokens                           │
│         ├─ ResetToken.deleteMany({ userId: user._id })        │
│         └─ Prevent token reuse                                 │
│         │                                                        │
│         ▼                                                        │
│  Step 7: Auto-Login After Reset                                │
│         ├─ Generate JWT token (same as login)                  │
│         ├─ Serialize HTTP-Only cookie                          │
│         └─ User doesn't need to re-login                       │
│         │                                                        │
│         ▼                                                        │
│  Return 200 + Cookie:                                          │
│  {                                                               │
│    "ok": true,                                                  │
│    "user": { _id, email }                                      │
│  }                                                               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Token Expiration Logic:**

```
Query: expiresAt: { $gt: new Date() }
├─ Greater than (>) = not expired
├─ Equals or less = expired (filtered out)
└─ Automatic cleanup via application logic
```

---

### 5. Session Management

**JWT Payload:**

```typescript
{
  sub: string; // Subject = user._id (for `verifyToken()`)
  email: string; // User email
  mobile: string; // User mobile
  role: string; // "user" or "admin"
  iat: number; // Issued at (timestamp)
  exp: number; // Expiration (timestamp)
}
```

**Token Flow:**

```
1. Generated: /api/auth/register, /api/auth/login, /api/auth/reset-password
2. Serialized: cookie.serialize() → HTTP-Only cookie
3. Sent: Set-Cookie response header
4. Stored: Browser automatically sends in each request
5. Verified: /api/auth/me extracts from cookies, verifies signature
6. Cleared: /api/auth/logout → maxAge: 0 (browser deletes)
```

---

## API Endpoints

### Authentication Endpoints

#### `POST /api/auth/register`

**Description:** Register new user

**Request Body:**

```json
{
  "name": "Dr. John Doe",
  "dob": "1985-06-15",
  "qualification": "PhD",
  "designation": "Senior Embryologist",
  "clinicName": "Fertility Center XYZ",
  "address": "123 Medical Lane, City",
  "workExp": "10+ years in clinical embryology",
  "mobile": "9876543210",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** `201 Created`

```json
{
  "ok": true,
  "user": {
    "_id": "67abc...",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "user"
  }
}
```

**Error Responses:**
| Status | Error | Reason |
|--------|-------|--------|
| 400 | Field required | Missing or empty field |
| 400 | Invalid email format | Email doesn't match regex |
| 400 | Invalid mobile number | Not 10 digits or wrong prefix |
| 400 | Invalid date of birth | Not valid ISO date |
| 400 | Password weak | Less than 8 chars or missing letters/numbers |
| 409 | Email already exists | User with email registered |
| 409 | Mobile already exists | User with mobile registered |
| 500 | Server error | Unexpected error |

---

#### `POST /api/auth/login`

**Description:** Authenticate user with email/mobile + password

**Request Body:**

```json
{
  "identifier": "john@example.com", // or "9876543210"
  "password": "SecurePass123"
}
```

**Response:** `200 OK` + Set-Cookie header

```json
{
  "ok": true,
  "user": {
    "_id": "67abc...",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "user"
  }
}
```

**Cookie Details:**

```
Set-Cookie: token=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900
├─ HttpOnly: Not accessible via JS (XSS protection)
├─ Secure: HTTPS only in production
├─ SameSite=Lax: CSRF protection (allows same-site requests)
└─ Max-Age: 15 minutes
```

**Error Responses:**
| Status | Error | Reason |
|--------|-------|--------|
| 400 | Email/Mobile and password required | Missing fields |
| 400 | Invalid email or mobile format | Format mismatch |
| 401 | Invalid login credentials | User not found OR wrong password |
| 500 | Server error | Database or token error |

---

#### `POST /api/auth/logout`

**Description:** Clear authentication cookie

**Request:** No body

**Response:** `200 OK`

```json
{
  "ok": true
}
```

**Cookie Cleared:**

```
Set-Cookie: token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0
```

---

#### `GET /api/auth/me`

**Description:** Get current authenticated user

**Request:** Cookie with valid JWT (auto-sent by browser)

**Response:** `200 OK`

```json
{
  "user": {
    "_id": "67abc...",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "designation": "Senior Embryologist",
    "role": "user",
    "createdAt": "2025-12-10T10:30:00Z"
    // Note: password, passwordResetToken, passwordResetExpires excluded
  }
}
```

**Error Responses:**
| Status | Error | Reason |
|--------|-------|--------|
| 401 | Not authenticated | No cookie sent or missing |
| 401 | Invalid token | Cookie invalid or expired |
| 404 | User not found | User deleted after token created |

---

#### `POST /api/auth/forgot-password`

**Description:** Initiate password reset (send email)

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK` (always)

```json
{
  "ok": true
}
```

**Email Sent To:**

```
Subject: Reset your password
Body: Click link to reset: {FRONTEND_URL}/reset-password?token={resetToken}
```

**Notes:**

- Always returns 200 (prevents email enumeration)
- Email may fail silently if SMTP misconfigured
- Token expires in 1 hour
- Old tokens deleted when new request made

---

#### `POST /api/auth/reset-password`

**Description:** Reset password using token from email

**Request Body:**

```json
{
  "token": "3f4a9c2b1e8d5f7a...", // From email link
  "newPassword": "NewSecurePass123"
}
```

**Response:** `200 OK` + Set-Cookie header

```json
{
  "ok": true,
  "user": {
    "_id": "67abc...",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
| Status | Error | Reason |
|--------|-------|--------|
| 400 | Token and password required | Missing fields |
| 400 | Invalid or expired token | Token hash mismatch or expired |
| 404 | Account not found | User deleted |
| 500 | Server error | Database error |

---

#### `PUT /api/auth/update-profile`

**Description:** Update user profile (requires authentication)

**Request:** JWT cookie required

**Request Body:** (any subset of allowed fields)

```json
{
  "name": "Dr. John Doe Jr.",
  "qualification": "PhD, MD",
  "designation": "Lead Embryologist",
  "clinicName": "New Fertility Center",
  "address": "456 New Street, City",
  "workExp": "15+ years",
  "mobile": "9876543211" // Can update mobile
}
```

**Allowed Fields:** name, dob, qualification, designation, clinicName, address, workExp, mobile

**Disallowed Fields:** email, password, role (ignored if sent)

**Response:** `200 OK`

```json
{
  "ok": true,
  "user": {
    "_id": "67abc...",
    "name": "Dr. John Doe Jr.",
    "email": "john@example.com",
    "mobile": "9876543211",
    "qualification": "PhD, MD"
    // ... other updated fields
    // Note: password excluded
  }
}
```

**Error Responses:**
| Status | Error | Reason |
|--------|-------|--------|
| 401 | Not authenticated | No valid JWT cookie |
| 401 | Invalid token | Malformed or expired JWT |
| 500 | Server error | Database update failed |

---

### Faculty Endpoints

#### `GET /api/faculty`

**Description:** Fetch faculty list (stub - not yet implemented)

**Response:** `200 OK`

```json
{
  "message": "Fetch doctors from DB here"
}
```

**TODO:** Implement MongoDB collection for faculty with full CRUD

---

#### `POST /api/faculty` (Admin)

**Description:** Add new faculty (stub - admin only)

**Response:**

```json
{
  "message": "Admin will add doctor here"
}
```

---

### CORS Handling

**Middleware:** `middleware.ts`

```typescript
// Allowed origins
- http://localhost:3000
- http://127.0.0.1:5500  // For external frontend testing

// Headers set
- Access-Control-Allow-Origin: [allowed origin]
- Access-Control-Allow-Credentials: true
- Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
- Access-Control-Allow-Headers: Content-Type, Authorization

// Applied to all /api/* routes
```

**OPTIONS Preflight:** All endpoints support OPTIONS (for CORS preflight)

---

## Frontend Structure

### Pages & Routes

```
/                          → Landing page (app/page.tsx)
├─ /login                 → Login form (app/login/page.tsx)
├─ /register              → Registration form (app/register/page.tsx)
├─ /dashboard             → User dashboard (protected)
├─ /profile               → User profile (protected)
├─ /reset-password        → Password reset form (with token param)
├─ /about                 → About page
├─ /faculty               → Faculty listing
│  └─ /faculty/[slug]     → Individual faculty detail (dynamic)
├─ /gallery               → Gallery page
└─ /webinars              → Webinars page
```

### Key Components

#### `Navbar.tsx`

**File:** `app/components/Navbar.tsx` (230 lines)

**Features:**

- Responsive navigation (hamburger on mobile)
- User authentication detection (auto-fetches `/api/auth/me`)
- Profile dropdown menu (when logged in)
- Logout functionality
- Navigation links dynamically styled
- User initial avatar (first letter of name)

**State Management:**

```typescript
const [user, setUser] = useState<any>(null); // Current user data
const [menuOpen, setMenuOpen] = useState(false); // Mobile menu toggle
const [profileOpen, setProfileOpen] = useState(false); // Profile dropdown
```

**User-Dependent UI:**

```
If NOT logged in:
  - Show "Login" & "Register" buttons

If logged in:
  - Show user initial avatar
  - Profile dropdown with:
    - "Profile" link
    - "Dashboard" link
    - "Logout" button
```

**Click-Outside Detection:**

```
useEffect hook handles:
  - Closing profile dropdown when clicking elsewhere
  - Closing mobile menu when clicking hamburger or outside
  - Prevents multiple open menus
```

---

#### `AnimatedLogoLoader.tsx`

**File:** `app/components/AnimatedLogoLoader.tsx` (168 lines)

**Features:**

- Full-screen loading overlay
- SVG-based logo with DNA animation
- GSAP-style animations via CSS

**Animation Details:**

```
1. DNA Helix: Stroke-dasharray animation
   - Left helix: Draws over 1.6s
   - Right helix: Draws after 0.3s delay

2. DNA Rungs: Individual animation
   - 7 horizontal rungs connecting helixes
   - Each rung staggered 0.12s delay
   - Creates wave effect

3. Text: Fade-in
   - "Global Academy" (main color: #1B3A5B)
   - "of Embryology" (accent color: #27B19B)

Colors:
  - Dark Blue: #1B3A5B (primary)
  - Teal: #27B19B (accent)
  - Light Background: #f5f8fc
```

**CSS Animations:**

```css
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  } /* Reveals SVG path */
}

.rung {
  animation: draw 0.8s ease forwards;
}
```

---

### Static Pages

**Faculty Data:** `app/faculty/data.ts`

Hardcoded faculty array (to be migrated to MongoDB):

```typescript
Faculty {
  id, slug, name, designation, specialization, experience,
  image, education, bio, achievements[], email
}

Example: Dr. Lenin Babu
  - Founder & Senior Clinical Embryologist
  - 15+ years experience
  - 500+ embryologists trained
  - 25+ publications
```

**Pages Using Data:**

- `/faculty` → Lists all faculty
- `/faculty/[slug]` → Dynamic detail page (e.g., `/faculty/dr-lenin-babu`)

---

### Client-Side Patterns

#### Fetch User on Mount (Navbar)

```typescript
useEffect(() => {
  async function loadUser() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null); // Not authenticated
    }
  }
  loadUser();
}, []);
```

#### Logout Handler

```typescript
async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST" });
  setUser(null);
  setProfileOpen(false);
  setMenuOpen(false);
}
```

#### Click-Outside Pattern

```typescript
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (profileRef.current && !profileRef.current.contains(target)) {
      setProfileOpen(false); // Close dropdown
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [menuOpen]);
```

---

## Security Considerations

### 1. Authentication Security

| Feature                   | Implementation                     | Benefit                          |
| ------------------------- | ---------------------------------- | -------------------------------- |
| **Password Hashing**      | bcryptjs (12 salt rounds)          | Prevents rainbow table attacks   |
| **Password Verification** | `bcrypt.compare()`                 | Timing attack resistant          |
| **HTTP-Only Cookies**     | `httpOnly: true` in cookie options | XSS protection (JS can't access) |
| **Secure Flag**           | HTTPS only in production           | MITM protection                  |
| **SameSite=Lax**          | CSRF protection                    | Prevents cross-site POST         |
| **Short JWT Expiration**  | 15 minutes                         | Limited token lifetime           |

---

### 2. Password Reset Security

| Feature                 | Implementation                  | Benefit                        |
| ----------------------- | ------------------------------- | ------------------------------ |
| **Token Hashing**       | SHA-256 hash in DB              | DB breach ≠ token forged       |
| **1 Hour Expiration**   | `expiresAt: Date.now() + 3600s` | Old tokens auto-expire         |
| **Single Use**          | `deleteMany()` after use        | Can't reuse same token         |
| **Plaintext in Email**  | User receives full token once   | Only email interceptor gets it |
| **Safe Email Response** | Always return 200               | Prevents email enumeration     |

---

### 3. User Enumeration Protection

| Endpoint                | Leak Prevention                                              |
| ----------------------- | ------------------------------------------------------------ |
| `POST /login`           | Returns 401 for both "user not found" & "wrong password"     |
| `POST /forgot-password` | Always returns 200 (email not revealed)                      |
| User Model              | `email` field has `unique: true` (prevents same email in DB) |

---

### 4. Database Security

```typescript
// Sensitive fields excluded from API responses:
- password (never sent)
- passwordResetToken (never sent)
- passwordResetExpires (never sent)

// Example:
User.findById(id).select("-password")
```

---

### 5. Input Validation

**Register/Login Validation:**

```typescript
isValidEmail(email); // RFC standard format
isValidMobile(mobile); // Indian 10-digit format
isStrongPassword(pwd); // Min 8 chars, letters + numbers
isValidDate(dob); // ISO format check
```

---

### 6. CORS Configuration

**Allowed Origins:**

- `http://localhost:3000` (dev)
- `http://127.0.0.1:5500` (external frontend testing)

**Credentials:** `true` (allows cookies in cross-origin requests)

---

### 7. Environment Variables (Required)

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=15m
COOKIE_NAME=token
COOKIE_MAX_AGE=900

# Password Hashing
BCRYPT_SALT_ROUNDS=12

# Email (Password Reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

---

## Development Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier OK)
- SMTP provider (Gmail, SendGrid, etc.)

### Installation

```bash
# 1. Clone repo & install dependencies
npm install

# 2. Create .env.local file
touch .env.local

# 3. Add environment variables (see above)
# MONGODB_URI, JWT_SECRET, SMTP config, etc.

# 4. Start dev server
npm run dev

# 5. Open browser
# http://localhost:3000
```

### Development Commands

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### MongoDB Connection

**Caching Strategy** (in `lib/mongodb.ts`):

```typescript
declare global {
  var _mongoose: { conn: null; promise: null };
}

let cached = global._mongoose;

export async function connectToDB() {
  if (cached.conn) return cached.conn; // Reuse connection
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI); // Create connection
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

**Benefits:**

- Prevents connection spam in dev (hot reload)
- Reuses pool in production
- Handles async connection initialization

---

## Deployment Notes

### Vercel (Recommended)

1. **Push to GitHub:**

```bash
git push origin main
```

2. **Connect to Vercel:**

- Visit vercel.com
- Import GitHub repo
- Auto-detects Next.js

3. **Set Environment Variables:**

```
MONGODB_URI=...
JWT_SECRET=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
BCRYPT_SALT_ROUNDS=12
JWT_EXPIRES_IN=15m
COOKIE_NAME=token
COOKIE_MAX_AGE=900
```

4. **Deploy:**

- Vercel auto-builds on push
- Serverless functions for API routes
- Edge caching for static assets

### Self-Hosted (Docker)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

**Environment Variables:** Set in production container or `.env` file

---

### Production Checklist

- [ ] `NODE_ENV=production`
- [ ] `BCRYPT_SALT_ROUNDS=12` or higher
- [ ] `JWT_EXPIRES_IN=15m` (reasonable timeout)
- [ ] HTTPS enforced (`secure: true` in cookies)
- [ ] CORS origins restricted to known domains
- [ ] MongoDB Atlas IP whitelist configured
- [ ] SMTP credentials secure (not in code)
- [ ] JWT_SECRET is cryptographically strong
- [ ] Error logging configured (Sentry, LogRocket, etc.)
- [ ] Database backups enabled

---

## Future Enhancements

### Planned Features

1. **Faculty Management:**

   - Migrate hardcoded `faculty/data.ts` to MongoDB collection
   - Admin CRUD endpoints (POST, PUT, DELETE)
   - Faculty profile images via cloud storage (Cloudinary, S3)

2. **Webinars/Events:**

   - Event model with registration
   - Email reminders before events
   - Attendance tracking

3. **Gallery:**

   - Image upload functionality
   - Album organization
   - Lazy loading optimization

4. **User Roles:**

   - Implement "admin" role checking
   - Admin dashboard (faculty management, user reports)
   - Permission-based route guards

5. **Advanced Authentication:**

   - Social login (Google, GitHub)
   - Two-factor authentication (2FA)
   - Session management (multiple devices)

6. **Email Templates:**

   - HTML email templates (for better UX)
   - Transactional email service (SendGrid, Postmark)

7. **Notifications:**

   - In-app notification system
   - Email digest summaries
   - Push notifications

8. **Search & Filtering:**

   - Full-text search on faculty
   - Faceted filtering

9. **Analytics:**

   - User engagement tracking
   - Event attendance analytics
   - Course completion metrics

10. **API Documentation:**
    - OpenAPI/Swagger docs
    - Rate limiting
    - API versioning

---

## Troubleshooting

### Common Issues

#### MongoDB Connection Fails

```
Error: Please define MONGODB_URI in .env

Solution:
1. Check .env.local exists
2. Verify MONGODB_URI is set
3. Ensure MongoDB Atlas network access allows your IP
4. Test connection string in MongoDB Compass
```

#### JWT Verification Fails

```
Error: Invalid token

Solutions:
1. Check JWT_SECRET matches across environments
2. Ensure cookie is being sent (check DevTools)
3. Verify JWT hasn't expired (15m default)
4. Check timestamp sync (server/client)
```

#### Email Sending Fails

```
Error: SMTP connection error

Solutions:
1. Verify SMTP credentials correct
2. Check firewall allows SMTP port (587, 465, 25)
3. Use app-specific passwords (Gmail)
4. Enable "Less Secure Apps" (if applicable)
5. Check SMTP_USER/SMTP_PASS in env
```

#### CORS Errors

```
Error: Access to XMLHttpRequest blocked by CORS policy

Solutions:
1. Check middleware.ts CORS origins
2. Add frontend domain to allowedOrigins
3. Ensure credentials: true in fetch requests
4. Test with curl/Postman first
```

---

## API Testing with cURL

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Test",
    "dob": "1990-01-01",
    "qualification": "PhD",
    "designation": "Embryologist",
    "clinicName": "Test Clinic",
    "address": "Test Address",
    "workExp": "5+ years",
    "mobile": "9876543210",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "Password123"
  }' \
  -c cookies.txt  # Save cookies
```

### Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt  # Send cookies
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

### Forgot Password

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Reset Password

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "RESET_TOKEN_FROM_EMAIL",
    "newPassword": "NewPassword123"
  }'
```

---

## License & Credits

- Built with **Next.js 16**
- Styled with **Tailwind CSS 4**
- Database: **MongoDB** + **Mongoose**
- Animations: **GSAP**
- Type Safety: **TypeScript 5**

---

**Last Updated:** December 13, 2025
**Project Version:** 0.1.0
**Status:** Active Development
