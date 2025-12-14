import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Gallery from "@/app/models/Gallery";
import { verifyAdmin } from "@/lib/verifyAdmin";

// GET: Fetch all gallery images
export async function GET() {
  try {
    await connectToDB();
    // Sort by newest first
    const gallery = await Gallery.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, gallery });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add new image (Admin Only)
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    
    if (!body.imageUrl || !body.title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();
    const newImage = await Gallery.create(body);

    return NextResponse.json({ success: true, data: newImage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}