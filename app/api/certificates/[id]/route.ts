import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // 1. FIX: Type is Promise
) {
  try {
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();

    // 2. FIX: Await the params to get the ID
    const { id } = await params; 
    const webinarId = id;

    // Fix ID matching
    const userId = user.id || user._id || user.userId || user.sub;

    // 1. Find the Webinar
    const webinar = await Webinar.findById(webinarId).lean();

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 });
    }

    // 2. Security Check: Is User Registered?
    const registration = webinar.registrations.find((r: any) => String(r.userId) === String(userId));
    
    if (!registration) {
      return NextResponse.json({ error: "You are not registered for this webinar." }, { status: 403 });
    }

    // 3. Security Check: Has it ended?
    if (new Date(webinar.dateTime) > new Date()) {
      return NextResponse.json({ error: "Certificate available only after the event." }, { status: 403 });
    }

    // 4. Return Data
    return NextResponse.json({
      details: {
        studentName: user.name || "Student Name",
        date: new Date(webinar.dateTime).toLocaleDateString(),
        certificateId: registration._id || new ObjectId(),
        webinarTitle: webinar.title
      },
      template: webinar.certificateTemplate,
      layout: webinar.certificateLayout || {
        name: { x: 300, y: 300, size: 30, color: "#000" },
        date: { x: 300, y: 400, size: 20, color: "#000" },
        qr: { x: 50, y: 50, size: 100 }
      }
    });

  } catch (error) {
    console.error("CERTIFICATE API ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}