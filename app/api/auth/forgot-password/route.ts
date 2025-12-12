// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import ResetToken from "@/app/models/ResetToken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { promisify } from "util";

const randomBytesAsync = promisify(crypto.randomBytes);

async function sendResetEmail(to: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Reset your password",
    text: `Reset your password: ${resetUrl}`,
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });
}

type Body = { email?: string };

export async function POST(req: Request) {
  await connectToDB();

  try {
    const body: Body = await req.json();
    const { email } = body;

    console.log("FORGOT PASSWORD ROUTE HIT", email);

    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) {
      // No user found → always return ok (prevent enumeration)
      return NextResponse.json({ ok: true });
    }

    // Create token
    const buf = await randomBytesAsync(32);
    const resetToken = buf.toString("hex");

    // Hash token before saving
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Remove any older reset token for this user
    await ResetToken.deleteMany({ userId: user._id });

    // Save new reset token in ResetToken collection
    await ResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour expiry
    });

    // Send email
    try {
      await sendResetEmail(user.email, resetToken);
    } catch (e) {
      console.error("Email error:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
