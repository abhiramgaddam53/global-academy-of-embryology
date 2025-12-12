// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import { signToken, serializeTokenCookie } from "@/lib/auth";

// Validation helpers
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidMobile = (mobile: string) =>
  /^[6-9]\d{9}$/.test(mobile); // Indian mobile format

type Body = { identifier?: string; password?: string };
// identifier = email OR mobile

export async function POST(req: Request) {
  await connectToDB();

  try {
    const body: Body = await req.json();
    const { identifier, password } = body;

    // ---------------------------
    // 1. Validate required inputs
    // ---------------------------
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/Mobile and password are required" },
        { status: 400 }
      );
    }

    // Determine if input is email or mobile
    let query: any = {};
    
    if (isValidEmail(identifier)) {
      query.email = identifier;
    } else if (isValidMobile(identifier)) {
      query.mobile = identifier;
    } else {
      return NextResponse.json(
        { error: "Invalid email or mobile format" },
        { status: 400 }
      );
    }

    // ---------------------------
    // 2. Find user by email OR mobile
    // ---------------------------
    const user = await User.findOne(query);

    // Never reveal whether email or mobile exists
    if (!user) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 401 }
      );
    }

    // ---------------------------
    // 3. Validate password
    // ---------------------------
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 401 }
      );
    }

    // ---------------------------
    // 4. Create JWT and set cookie
    // ---------------------------
    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      mobile: user.mobile,
      role:user.role,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role:user.role,
      },
    });

    response.headers.set("Set-Cookie", serializeTokenCookie(token));
    return response;

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
