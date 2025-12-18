import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function GET(req: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    // Fetch all webinars but only need specific fields
    // .lean() converts Mongoose documents to plain JS objects for better performance
    const webinars = await Webinar.find({})
      .select("title dateTime certificateTemplate registrations")
      .sort({ dateTime: -1 })
      .lean();

    // Process data for the dashboard stats
    const stats = {
      totalCertificatesConfigured: 0,
      totalIssued: 0, // In this context, 'Issued' represents eligible users (registrations)
      pendingConfig: 0,
    };

    const certificateList = webinars.map((webinar) => {
      const hasCert = !!webinar.certificateTemplate;
      
      if (hasCert) {
        stats.totalCertificatesConfigured++;
      } else {
        stats.pendingConfig++;
      }
      
      // Calculate potential issuance based on registrations
      const potentialIssuance = webinar.registrations ? webinar.registrations.length : 0;
      if (hasCert) {
        stats.totalIssued += potentialIssuance;
      }

      return {
        _id: webinar._id,
        title: webinar.title,
        date: webinar.dateTime,
        hasTemplate: hasCert,
        registeredCount: potentialIssuance,
      };
    });

    return NextResponse.json({
      stats,
      certificates: certificateList
    });

  } catch (err) {
    console.error("Certificate API Error:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}