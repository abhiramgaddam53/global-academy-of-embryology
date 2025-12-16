import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { hashPassword, verifyPassword } from "@/lib/auth"; // Ensure these are imported from your auth helper

export async function POST(req: Request) {
  try {
    await connectToDB();

    // 1. Get Logged-in User
    const tokenUser = await getUserFromToken();
    if (!tokenUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Body
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current and new passwords are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // 3. Find User in DB (to get the real password hash)
    // We use the ID from the token (handling both 'id', '_id', and 'sub')
    const userId = tokenUser.id || tokenUser._id || tokenUser.sub;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 4. Verify Old Password
    // Check if the current password provided matches the hash in DB
    const isValid = await verifyPassword(currentPassword, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect current password." },
        { status: 400 }
      );
    }

    // 5. Hash New Password & Save
    user.password = newPassword; // Pass plain text
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "Password updated successfully." 
    },
    { status: 200 });

  } catch (err: any) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}