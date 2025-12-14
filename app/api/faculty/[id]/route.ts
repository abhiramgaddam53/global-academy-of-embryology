import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Faculty from "@/app/models/Faculty";
import { verifyAdmin } from "@/lib/verifyAdmin";

// GET: Fetch single faculty member details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Type as Promise
) {
  try {
    const { id } = await params; // 2. Await params

    await connectToDB();
    const faculty = await Faculty.findById(id);

    if (!faculty) {
      return NextResponse.json({ success: false, error: "Faculty not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: faculty });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update faculty member (Admin Only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params

    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    await connectToDB();

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedFaculty) {
      return NextResponse.json({ success: false, error: "Faculty not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedFaculty });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove faculty member (Admin Only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params

    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await connectToDB();
    const deletedFaculty = await Faculty.findByIdAndDelete(id);

    if (!deletedFaculty) {
      return NextResponse.json({ success: false, error: "Faculty not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Faculty member deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}