// lib/auth.ts
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || "900", 10);

if (!JWT_SECRET) throw new Error("Please set JWT_SECRET in env");

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET as string, { 
    expiresIn: JWT_EXPIRES_IN 
  } as any);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { [k: string]: any } | null;
  } catch (e) {
    return null;
  }
}

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
