import { NextResponse } from "next/server";

// TEMP — later replace with DB logic
export async function GET() {
  return NextResponse.json({ message: "Fetch doctors from DB here" });
}

export async function POST() {
  return NextResponse.json({ message: "Admin will add doctor here" });
}

export async function PUT() {
  return NextResponse.json({ message: "Admin will update doctor here" });
}

export async function DELETE() {
  return NextResponse.json({ message: "Admin will delete doctor here" });
}
