import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Contact from "@/app/models/Contact";
import { verifyAdmin } from "@/lib/verifyAdmin";

// POST: Submit a new contact message (Public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic Validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();
    await Contact.create(body);

    return NextResponse.json({ success: true, message: "Message sent successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: Fetch all messages (Admin Only)
export async function GET(request: NextRequest) {
  try {
    // Verify Admin
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDB();
    const messages = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}