// import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/auth";
// import User from "@/app/models/User";
// import { connectToDB } from "@/lib/mongodb";

// export async function PUT(req: Request) {
//   await connectToDB();

//   try {
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.split("token=")?.[1];

//     if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

//     const decoded = verifyToken(token);
//     if (!decoded?.sub) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

//     const body = await req.json();

//     const allowed = [
//       "name",
//       "dob",
//       "qualification",
//       "designation",
//       "clinicName",
//       "address",
//       "workExp",
//       "mobile",
//     ];

//     const updates: Record<string, any> = {};
//     for (const key of allowed) {
//       if (key in body) updates[key] = body[key];
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       decoded.sub,
//       { $set: updates },
//       { new: true }
//     ).select("-password");

//     return NextResponse.json({ ok: true, user: updatedUser });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import User from "@/app/models/User";
import { connectToDB } from "@/lib/mongodb";

export async function PUT(req: Request) {
  try {
    await connectToDB();

    // 1. Get Token from Cookies
    const cookie = req.headers.get("cookie") || "";
    // Robustly parse the 'token' cookie
    const token = cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Verify Token
    const decoded = verifyToken(token);
    if (!decoded?.sub) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 3. Get Data from Frontend
    const body = await req.json();

    // 4. Define Allowed Fields
    // We explicitly add "image" here so the DB accepts the Base64 string
    const allowed = [
      "name",
      "dob",
      "qualification",
      "designation",
      "clinicName",
      "address",
      "workExp",
      "mobile",
      "image", // ✅ CRITICAL: This allows the profile picture to be saved
    ];

    // 5. Filter the update object
    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    // 6. Update User in Database
    const updatedUser = await User.findByIdAndUpdate(
      decoded.sub,
      { $set: updates },
      { new: true } // Return the updated document
    ).select("-password"); // Do not send back the password

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user: updatedUser });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}