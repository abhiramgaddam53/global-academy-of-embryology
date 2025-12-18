// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { connectToDB } from "@/lib/mongodb";
// import Webinar from "@/app/models/Webinar";
// import { verifyAdmin } from "@/lib/verifyAdmin";
// import { getUserFromToken } from "@/lib/getUserFromToken";

// /* ================= GET SINGLE WEBINAR ================= */
// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
  
//   try {
//     await connectToDB();
//     const { id } = await params;

//     // 🛡 Prevent ObjectId crash
//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { error: "Invalid webinar id" },
//         { status: 400 }
//       );
//     }

//     const webinar = await Webinar.findById(id).lean();
//     if (!webinar) {
//       return NextResponse.json(
//         { error: "Webinar not found" },
//         { status: 404 }
//       );
//     }

//    const user = await getUserFromToken();
//    const isAdmin = user && (await verifyAdmin(  ));

//    const now = new Date();
//    const startTime = new Date(webinar.dateTime);

//    // ✅ TIME-BASED FLAGS (AS REQUESTED)
//    const isStarted = now >= startTime;
//    const isPast = now >= startTime;

//    const registrations = webinar.registrations || [];

//    const isRegistered =
//      !!user &&
//      registrations.some(
//        (r: { userId: string }) => r.userId === user.id
//      );
//     // 🔓 ADMIN: return everything, no filters
//     if (isAdmin) {
//       return NextResponse.json({
//         ...webinar,
//         isRegistered: false,
//         isStarted,
//         isPast,
//         registeredCount: registrations.length,
//       });
//     }


//     /* ---------------- VISIBILITY RULES ---------------- */

//     // UPCOMING (before date/time)
//     if (!isStarted) {
//       delete webinar.webinarLink;
//       delete webinar.recordedLink;
//     }

//     // LIVE OR PAST (date crossed)
//     if (isStarted) {
//       // live link only for registered users
//       if (!isRegistered) {
//         delete webinar.webinarLink;
//       }

//       // recording visible ONLY if admin added it
//       if (!webinar.recordedLink) {
//         delete webinar.recordedLink;
//       }
//     }

//     return NextResponse.json({
//       ...webinar,
//       isRegistered,
//       isStarted,
//       isPast,
//       registeredCount: registrations.length,
//     });
//   } catch (err) {
//     console.error("GET WEBINAR ERROR:", err);
//     return NextResponse.json(
//       { error: "Error fetching webinar" },
//       { status: 500 }
//     );
//   }
// }

// /* ================= UPDATE WEBINAR (ADMIN) ================= */
// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     if (!verifyAdmin( )) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     await connectToDB();
//     const { id } = await params;

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { error: "Invalid webinar id" },
//         { status: 400 }
//       );
//     }

//     const data = await req.json();

//     // 🔒 Prevent accidental registration overwrite
//     const { registrations, ...safeData } = data;

//     const updated = await Webinar.findByIdAndUpdate(id, safeData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updated) {
//       return NextResponse.json(
//         { error: "Webinar not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(updated);
//   } catch (err) {
//     console.error("UPDATE WEBINAR ERROR:", err);
//     return NextResponse.json(
//       { error: "Error updating webinar" },
//       { status: 500 }
//     );
//   }
// }

// /* ================= DELETE WEBINAR (ADMIN) ================= */
// export async function DELETE(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     if (!verifyAdmin( )) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     await connectToDB();
//     const { id } = await params;

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { error: "Invalid webinar id" },
//         { status: 400 }
//       );
//     }

//     const deleted = await Webinar.findByIdAndDelete(id);
//     if (!deleted) {
//       return NextResponse.json(
//         { error: "Webinar not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       message: "Webinar deleted successfully",
//     });
//   } catch (err) {
//     console.error("DELETE WEBINAR ERROR:", err);
//     return NextResponse.json(
//       { error: "Error deleting webinar" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { getUserFromToken } from "@/lib/getUserFromToken";

/* ================= GET SINGLE WEBINAR ================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  
  try {
    await connectToDB();
    const { id } = await params;

    // 🛡 Prevent ObjectId crash
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid webinar id" },
        { status: 400 }
      );
    }

    const webinar = await Webinar.findById(id).lean();
    if (!webinar) {
      return NextResponse.json(
        { error: "Webinar not found" },
        { status: 404 }
      );
    }

   const user = await getUserFromToken();
   const isAdmin = user && (await verifyAdmin());

   const now = new Date();
   const startTime = new Date(webinar.dateTime);
   const endOfDay = new Date(startTime);
   endOfDay.setHours(23, 59, 59, 999); 
   // ✅ TIME-BASED FLAGS
   const isStarted = now >= startTime;
   const isPast = now >= endOfDay;

   const registrations = webinar.registrations || [];

   // ✅ FIX: Robust ID Checking
   // Your token uses 'sub', but some helpers return 'id' or '_id'. We check all.
   let isRegistered = false;

   if (user) {
     const currentUserId = user.id || user._id || user.sub;

     if (currentUserId) {
        isRegistered = registrations.some(
          (r: { userId: string }) => r.userId.toString() === currentUserId.toString()
        );
     }
   }

    // 🔓 ADMIN: return everything, no filters
    if (isAdmin) {
      return NextResponse.json({
        ...webinar,
        isRegistered: false, // Admins don't usually "register", but you can set true if needed
        isStarted,
        isPast,
        registeredCount: registrations.length,
      });
    }


    /* ---------------- VISIBILITY RULES ---------------- */

    // UPCOMING (before date/time)
    if (!isStarted) {
      delete webinar.webinarLink;
      delete webinar.recordedLink;
    }

    // LIVE OR PAST (date crossed)
    if (isStarted) {
      // live link only for registered users
      if (!isRegistered) {
        delete webinar.webinarLink;
      }

      // recording visible ONLY if admin added it
      if (!webinar.recordedLink) {
        delete webinar.recordedLink;
      }
    }

    return NextResponse.json({
      ...webinar,
      isRegistered, // This will now correctly reflect the user's status
      isStarted,
      isPast,
      registeredCount: registrations.length,
    });
  } catch (err) {
    console.error("GET WEBINAR ERROR:", err);
    return NextResponse.json(
      { error: "Error fetching webinar" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE WEBINAR (ADMIN) ================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin( )) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDB();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid webinar id" },
        { status: 400 }
      );
    }

    const data = await req.json();

    // 🔒 Prevent accidental registration overwrite
    const { registrations, ...safeData } = data;
    console.log(safeData);
    const updated = await Webinar.findByIdAndUpdate(id, safeData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Webinar not found" },
        { status: 404 }
      );
    }
    console.log(updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE WEBINAR ERROR:", err);
    return NextResponse.json(
      { error: "Error updating webinar" },
      { status: 500 }
    );
  }
}

/* ================= DELETE WEBINAR (ADMIN) ================= */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin( )) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDB();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid webinar id" },
        { status: 400 }
      );
    }

    const deleted = await Webinar.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Webinar not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Webinar deleted successfully",
    });
  } catch (err) {
    console.error("DELETE WEBINAR ERROR:", err);
    return NextResponse.json(
      { error: "Error deleting webinar" },
      { status: 500 }
    );
  }
}