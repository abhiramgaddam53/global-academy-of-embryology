import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
        console.log("❌ CERT DEBUG: No user token found");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const userId = user.id || user._id || user.sub;
    
    console.log("------------------------------------------------");
    console.log("🔍 CERTIFICATE DEBUG LOGS");
    console.log("👤 User ID:", userId);

    // 1. BROAD SEARCH: Find ANY webinar this user is registered for
    // We REMOVED the 'certificateTemplate' filter here to see if we find the webinars first
    const webinars = await Webinar.find({
      "registrations.userId": String(userId)
    }).lean();

    console.log(`📚 Total Webinars User is Registered For: ${webinars.length}`);

    const now = new Date();
    const validCertificates = [];

    // 2. Loop through and check why they might be failing
    for (const web of webinars) {
        console.log(`\n🔎 Checking Webinar: "${web.title}"`);
        
        // CHECK A: Does it have a template?
        // We check if it exists AND is not an empty string
        const hasTemplate = web.certificateTemplate && web.certificateTemplate.trim().length > 0;
        console.log(`   - Has Template Image? ${hasTemplate ? "✅ Yes" : "❌ NO (Reason for failure)"}`);

        // CHECK B: Is it in the past?
        const webDate = new Date(web.dateTime);
        const isPast = webDate < now;
        console.log(`   - Event Ended? ${isPast ? "✅ Yes" : "❌ NO (Future Event)"}`);

        if (hasTemplate && isPast) {
            // Find specific registration
            const registration = web.registrations.find((r: any) => String(r.userId) === String(userId));
            
            if (registration) {
                validCertificates.push({
                    webinarId: web._id,
                    certificateId: registration._id,
                    title: web.title,
                    issueDate: webDate.toLocaleDateString(),
                    instructor: web.mentors && web.mentors.length > 0 ? web.mentors[0] : "GAE Faculty",
                    score: "Verified"
                });
                console.log("   🎉 Certificate Added!");
            }
        }
    }

    console.log(`\n✅ Returning ${validCertificates.length} certificates.`);
    console.log("------------------------------------------------");

    // Sort newest first
    validCertificates.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    return NextResponse.json(validCertificates);

  } catch (err) {
    console.error("FETCH CERTIFICATES ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}