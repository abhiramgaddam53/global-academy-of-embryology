// app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import ResetToken from "@/app/models/ResetToken";
import crypto from "crypto";
import { signToken, serializeTokenCookie } from "@/lib/auth";

type Body = { token?: string; newPassword?: string };

export async function POST(req: Request) {
  await connectToDB();

  try {
    const body: Body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Hash the token to match DB entry
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find reset token record
    const resetRecord = await ResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() }, // Not expired
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Find linked user
    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    // Delete token after use
    await ResetToken.deleteMany({ userId: user._id });

    // Generate JWT for immediate login after reset
    const jwt = signToken({
      sub: user._id.toString(),
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        _id: user._id,
        email: user.email,
      },
    });

    // Attach HttpOnly cookie
    res.headers.set("Set-Cookie", serializeTokenCookie(jwt));

    return res;
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
