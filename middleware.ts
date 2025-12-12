// middleware.ts
import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const origin = req.headers.get("origin") || "";

  // Allow your external frontend (127.0.0.1:5500)
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:5500"
  ];

  const res = NextResponse.next();

  if (allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
