import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import Faculty from "@/app/models/Faculty"; // Uncomment if you have this model
import Contact from "@/app/models/Contact"; // Uncomment if you have this model

export async function GET() {
  try {
    await connectToDB();

    const now = new Date();

    // 1. Active Webinars (Upcoming events)
    const activeWebinarsCount = await Webinar.countDocuments({ dateTime: { $gte: now } });

    // 2. Certificates Issued 
    // Logic: Sum of all registrations for webinars that have already ended
    const certStats = await Webinar.aggregate([
      { $match: { dateTime: { $lt: now } } }, // Filter for past webinars
      { $project: { count: { $ifNull: [{ $size: "$registrations" }, 0] } } }, // Count attendees
      { $group: { _id: null, total: { $sum: "$count" } } } // Sum all counts
    ]);
    const certificatesIssued = certStats.length > 0 ? certStats[0].total : 0;

    // 3. Faculty Count (Placeholder logic if model missing)
    let facultyCount = 0;
    try {
       facultyCount = await Faculty.countDocuments({});
       // For now, returning dummy if model doesn't exist
     } catch (e) { console.log("Faculty model missing"); }

    // 4. New Inquiries (Placeholder logic)
    let inquiriesCount = 0;
    try {
       inquiriesCount = await Contact.countDocuments({});
     } catch (e) { console.log("Contact model missing"); }

    return NextResponse.json({
      webinars: activeWebinarsCount,
      faculty: facultyCount,
      certificates: certificatesIssued,
      inquiries: inquiriesCount
    });

  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}