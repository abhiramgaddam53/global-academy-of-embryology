import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";

export async function GET() {
  try {
    await connectToDB();

    const now = new Date();

    const upcoming = await Webinar.find({ dateTime: { $gte: now } })
      .sort({ dateTime: 1 });

    return NextResponse.json(upcoming);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch upcoming webinars" }, { status: 500 });
  }
}
