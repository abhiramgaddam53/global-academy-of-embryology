// lib/auth.ts
import jwt, { SignOptions } from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || "900", 10);
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

if (!JWT_SECRET) throw new Error("Please set JWT_SECRET in env");

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT functions
export function signToken(payload: Record<string, unknown>) {
  // Cast to 'any' to bypass the strict StringValue type check
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { [k: string]: any } | null;
  } catch (e) {
    return null;
  }
}

// JWT alias for compatibility
export function signJwt(payload: Record<string, unknown>, expiresIn?: string) {
  // Cast to 'any' here as well
  const options: SignOptions = { expiresIn: (expiresIn || JWT_EXPIRES_IN) as any };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt(token: string) {
  return verifyToken(token);
}

// Cookie functions
export function serializeTokenCookie(token: string) {
  return cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function serializeRemoveTokenCookie() {
  return cookie.serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}