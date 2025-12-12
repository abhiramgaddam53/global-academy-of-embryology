// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import { verifyToken } from "@/lib/auth";
import cookie from "cookie";

export async function GET(req: Request) {
  await connectToDB();

  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = cookie.parse(cookieHeader || "");
  const tokenName = process.env.COOKIE_NAME || "token";
  const token = cookies[tokenName];

  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || !payload.sub) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const user = await User.findById(payload.sub).select("-password -passwordResetToken -passwordResetExpires");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user });
}
export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
  }