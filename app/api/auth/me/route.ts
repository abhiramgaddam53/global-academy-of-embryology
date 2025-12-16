import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // ✅ Reliable cookie method for Next.js 15
import { connectToDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    // 1. Get Token using Next.js helper (Awaited in Next.js 15)
    const cookieStore = await cookies();
    const tokenName = process.env.COOKIE_NAME || "token";
    const token = cookieStore.get(tokenName)?.value;

    // If no token, return null user (Status 200 = Success, but empty)
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // 2. Verify Token
    const payload = verifyToken(token);
    
    // If token is invalid or expired
    if (!payload || !payload.sub) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectToDB();

    // 3. Find User
    // We explicitly select 'image' to ensure the profile pic works
    const user = await User.findById(payload.sub).select("-password -passwordResetToken -passwordResetExpires");

    // If token has ID but user deleted from DB
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // 4. Success
    return NextResponse.json({ user }, { status: 200 });

  } catch (err) {
    console.error("AUTH ME ERROR:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}