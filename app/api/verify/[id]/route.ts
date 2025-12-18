import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import User from "@/app/models/User";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params; // Certificate ID (Registration ID)

    // 1. Find the webinar that contains this specific registration ID
    const webinar = await Webinar.findOne({
      "registrations._id": id
    }).lean();

    if (!webinar) {
      return NextResponse.json({ valid: false }, { status: 404 });
    }

    // 2. Extract the specific registration details
    const registration = webinar.registrations.find(
      (r: any) => String(r._id) === id
    );

    if (!registration) {
      return NextResponse.json({ valid: false }, { status: 404 });
    }

    // 3. Fetch Student Name (since it's not stored in registration directly)
    const user = await User.findById(registration.userId).lean();
    const studentName = user ?  user.name  : "Valued Student";

    // 4. Return Valid Details
    return NextResponse.json({
      valid: true,
      data: {
        studentName: studentName,
        webinarTitle: webinar.title,
        date: new Date(webinar.dateTime).toLocaleDateString(),
        certificateId: id
      }
    });

  } catch (error) {
    console.error("VERIFY API ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}