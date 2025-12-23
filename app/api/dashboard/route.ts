import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET(req: Request) {
  try {
    // 1. Authenticate
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();
 

    // DETERMINE THE RIGHT ID
    // Check if the token uses 'id', '_id', 'userId', or 'sub'
    const userId = user.id || user._id || user.userId || user.sub; 
    // console.log("2. Extracted User ID:", userId, "| Type:", typeof userId);

    // 3. Find webinars
    // We cast userId to String just in case to match the Schema definition
    const allWebinars = await Webinar.find({
      "registrations.userId": String(userId) 
    }).lean();

    // 🔍 DEBUG LOG 2: Check database results
    // console.log(`3. Webinars Found for this user: ${allWebinars.length}`);

    if (allWebinars.length === 0) {
      // If 0 found, let's look at ONE webinar to see how registrations are actually saved
      const sample = await Webinar.findOne({ "registrations": { $exists: true, $not: { $size: 0 } } }).lean();
       
    }
 
    /* ================= PROCESSING (Standard Logic) ================= */
    const now = new Date();
    const upcoming = [];
    const past = [];
    const certificates = [];

    for (const web of allWebinars) {
      const webDate = new Date(web.dateTime);
      
      const info = {
        _id: web._id,
        title: web.title,
        date: web.dateTime,
        imageUrl: web.imageUrl,
        // Safe access to registeredAt
        registeredAt: web.registrations.find((r: any) => String(r.userId) === String(userId))?.registeredAt
      };

      if (webDate > now) {
        upcoming.push(info);
      } else {
        past.push(info);
        if (web.certificateTemplate) {
          certificates.push(info);
        }
      }
    }

    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      user: {
        name: user.name || user.email || "Student",
        id: userId,
        stats: {
          registered: allWebinars.length,
          certificates: certificates.length
        }
      },
      nextUp: upcoming[0] || null,
      history: past.slice(0, 5),
      certificates: certificates
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}