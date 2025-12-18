import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import { verifyAdmin } from "@/lib/verifyAdmin";

/* ================= CREATE WEBINAR (ADMIN) ================= */
export async function POST(req: Request) {
  try {
    // Only admin can create webinars
    if (!verifyAdmin()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDB();
    const body = await req.json();
    console.log(body)
    // 🔍 Required validation
    if (!body.title || !body.dateTime) {
      return NextResponse.json(
        { error: "Title and dateTime are required" },
        { status: 400 }
      );
    }

    /**
     * IMPORTANT RULES:
     * - webinarLink → optional (can be added/edited later)
     * - recordedLink → MUST exist but EMPTY initially
     * - registrations → empty at creation
     */
    const webinarData = {
      title: body.title,
      description: body.description || "",
      imageUrl: body.imageUrl || "",

      // FIX: Add certificate fields to save them in DB
      certificateTemplate: body.certificateTemplate || "",
      certificateLayout: body.certificateLayout || {}, 

      webinarLink: body.webinarLink || "", // live link (optional)
      recordedLink: "", // empty at creation

      dateTime: new Date(body.dateTime),
      mentors: Array.isArray(body.mentors) ? body.mentors : [],

      registrations: [],
    };
    console.log(webinarData)
    const webinar = await Webinar.create(webinarData);

    return NextResponse.json(webinar, { status: 201 });
  } catch (err: any) {
    console.error("CREATE WEBINAR ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create webinar" },
      { status: 500 }
    );
  }
}

/* ================= LIST ALL WEBINARS ================= */
export async function GET() {
  try {
    await connectToDB();

    // Upcoming first, past later
    const webinars = await Webinar.find().sort({ dateTime: 1 });

    return NextResponse.json(webinars);
  } catch (err) {
    console.error("FETCH WEBINARS ERROR:", err);
    return NextResponse.json(
      { error: "Error fetching webinars" },
      { status: 500 }
    );
  }
}