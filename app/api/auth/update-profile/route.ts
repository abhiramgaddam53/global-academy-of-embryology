import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import User from "@/app/models/User";
import { connectToDB } from "@/lib/mongodb";

export async function PUT(req: Request) {
  await connectToDB();

  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.split("token=")?.[1];

    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded?.sub) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();

    const allowed = [
      "name",
      "dob",
      "qualification",
      "designation",
      "clinicName",
      "address",
      "workExp",
      "mobile",
    ];

    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.sub,
      { $set: updates },
      { new: true }
    ).select("-password");

    return NextResponse.json({ ok: true, user: updatedUser });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
