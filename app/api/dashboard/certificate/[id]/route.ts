import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import User from "@/app/models/User"; // ⚠️ Make sure this path to your User model is correct
import { getUserFromToken } from "@/lib/getUserFromToken"; 
import { ObjectId } from "mongodb";

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const userToken = await getUserFromToken();
    if (!userToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();

    const { id } = await params; 
    const webinarId = id;
    
    // 1. Get User ID from Token (Your logs show it is 'sub')
    const userId = userToken.sub || userToken.id || userToken._id;

    // 2. FETCH REAL NAME FROM DB
    // Since token doesn't have name, we query the User collection
    let studentName = "Valued Student";
    try {
        const dbUser = await User.findById(userId).lean();
        if (dbUser) {
            // Check common name fields. Adjust if your DB uses 'firstName' etc.
            studentName = dbUser.name ||  userToken.email.split('@')[0];
            console.log("✅ Found User Name in DB:", studentName);
        } else {
            console.log("⚠️ User found in token but NOT in DB");
        }
    } catch (e) {
        console.error("Error fetching user details:", e);
    }

    // 3. Find Webinar
    if (!ObjectId.isValid(webinarId)) {
       return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const webinar = await Webinar.findById(webinarId).lean();

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 });
    }

    // 4. Check Registration
    // We compare strings to ensure 'sub' matches the registered ID
    const registration = webinar.registrations.find((r: any) => String(r.userId) === String(userId));
    
    if (!registration) {
      return NextResponse.json({ error: "You are not registered for this webinar." }, { status: 403 });
    }

    // 5. Return Data with REAL Name
    return NextResponse.json({
      details: {
        studentName: studentName, 
        date: new Date(webinar.dateTime).toLocaleDateString(),
        certificateId: registration._id || new ObjectId(),
        webinarTitle: webinar.title
      },
      template: webinar.certificateTemplate,
      layout: webinar.certificateLayout
    });

  } catch (error) {
    console.error("CERTIFICATE API ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}