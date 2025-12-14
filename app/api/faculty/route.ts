import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb"; // Assumed DB connection helper
import Faculty from "@/app/models/Faculty";
import { verifyAdmin } from "@/lib/verifyAdmin"; // Assumed admin check helper

// GET: Fetch all faculty members
export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    const facultyMembers = await Faculty.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: facultyMembers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new faculty member (Admin Only)
export async function POST(request: NextRequest) {
  try {
    // 1. Verify Admin Access
    const admin = await verifyAdmin( );
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // 2. Parse Body
    const body = await request.json();
    const {
      name,
      email,
      designation,
      specialization,
      experience,
      education,
      bio,
      image,
      achievements
    } = body;

    // 3. Validation (Basic)
    if (!name || !email || !designation || !specialization) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDB();

    // 4. Check for existing faculty with same email
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return NextResponse.json(
        { success: false, error: "Faculty with this email already exists" },
        { status: 409 }
      );
    }

    // 5. Create Record
    const newFaculty = await Faculty.create({
      name,
      email,
      designation,
      specialization,
      experience,
      education,
      bio,
      image,
      achievements,
    });

    return NextResponse.json({ success: true, data: newFaculty }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}