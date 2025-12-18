import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import { getUserFromToken } from "@/lib/getUserFromToken"; // Adjust path if needed

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    // Fix ID matching (Handle string vs ObjectId)
    const userId = user.id || user._id || user.userId || user.sub;

    // Fetch all webinars user is registered for
    const webinars = await Webinar.find({
      "registrations.userId": String(userId)
    }).lean();

    const now = new Date();

    const formatted = webinars.map((web: any) => {
        const isPast = new Date(web.dateTime) < now;
        const hasCertificate = isPast && !!web.certificateTemplate;

        return {
            _id: web._id,
            title: web.title,
            date: new Date(web.dateTime).toLocaleDateString(),
            time: new Date(web.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            dateTimeRaw: web.dateTime,
            status: isPast ? "past" : "upcoming",
            category: "General", 
            image: web.imageUrl || "",
            hasCertificate: hasCertificate,
            recordedLink: web.recordedLink || ""
        };
    });

    // Sort: Upcoming (Ascending), Past (Descending)
    formatted.sort((a, b) => new Date(b.dateTimeRaw).getTime() - new Date(a.dateTimeRaw).getTime());

    return NextResponse.json(formatted);

  } catch (err) {
    console.error("FETCH USER WEBINARS ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}