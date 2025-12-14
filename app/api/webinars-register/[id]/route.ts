// import { NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongodb";
// import Webinar from "@/app/models/Webinar";
// import { transporter } from "@/lib/mailer";
// import { getUserFromToken } from "@/lib/getUserFromToken";

// const mailHtml = (webinar: any) => `
//   <h2>${webinar.title}</h2>
//   <p>${webinar.description}</p>

//   <p><strong>Date & Time:</strong>
//     ${new Date(webinar.dateTime).toLocaleString()}
//   </p>

//   <p><strong>Mentors:</strong>
//     ${webinar.mentors.join(", ")}
//   </p>

//   <p>
//     🔗 <strong>Webinar Link:</strong><br/>
//     <a href="${webinar.webinarLink}">
//       Click here to join the webinar
//     </a>
//   </p>

//   <p style="color: #555;">
//     You can also access this link from the website
//     <strong>after the session starts</strong>.
//   </p>
// `;

// export async function POST(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectToDB();

//     // ✅ Get logged-in user
//     const user = await getUserFromToken();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const webinar = await Webinar.findById(params.id);
//     if (!webinar) {
//       return NextResponse.json({ error: "Webinar not found" }, { status: 404 });
//     }

//     // ✅ Prevent duplicate registration
//     const alreadyRegistered = webinar.registrations.some(
//       (r: { userId: string }) => r.userId === user.id
//     );

//     if (alreadyRegistered) {
//       return NextResponse.json({ message: "Already registered" });
//     }

//     // ✅ Store BOTH userId and email
//     webinar.registrations.push({
//       userId: user.id,
//       email: user.email,
//     });

//     await webinar.save();

//     // ✅ Send email WITH LINK (even before start)
//     await transporter.sendMail({
//       from: `"Webinar Team" <${process.env.SMTP_USER}>`,
//       to: user.email,
//       subject: `Registration Confirmed: ${webinar.title}`,
//       html: mailHtml(webinar),
//     });

//     return NextResponse.json({ message: "Registered successfully" },{ status: 200 });
//   } catch (err) {
//     console.error("Registration Error:", err);
//     return NextResponse.json(
//       { error: "Registration failed" },
//       { status: 500 }
//     );
//   }
//   // return new Response("OK");

// }
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Webinar from "@/app/models/Webinar";
import { transporter } from "@/lib/mailer";
import { getUserFromToken } from "@/lib/getUserFromToken";

const mailHtml = (webinar: any) => `
  <h2>${webinar.title}</h2>
  <p>${webinar.description}</p>

  <p><strong>Date & Time:</strong>
    ${new Date(webinar.dateTime).toLocaleString()}
  </p>

  <p><strong>Mentors:</strong>
    ${webinar.mentors.join(", ")}
  </p>

  <p>
    🔗 <strong>Webinar Link:</strong><br/>
    <a href="${webinar.webinarLink}">
      Click here to join the webinar
    </a>
  </p>

  <p style="color: #555;">
    You can also access this link from the website
    <strong>after the session starts</strong>.
  </p>
`;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await params;

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ FIX: Added 'user.sub' because your JWT uses 'sub' for the ID
    const userId = user.id || user._id || user.sub;

    if (!userId) {
      console.error("User token missing ID field:", user);
      return NextResponse.json({ error: "Invalid Token Structure" }, { status: 401 });
    }

    const webinar = await Webinar.findById(id);
    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 });
    }

    // ✅ Compare using the extracted userId
    const alreadyRegistered = webinar.registrations.some(
      (r: { userId: string }) => r.userId.toString() === userId.toString()
    );

    if (alreadyRegistered) {
      return NextResponse.json({ message: "Already registered" });
    }

    // ✅ Save userId as string
    webinar.registrations.push({
      userId: userId.toString(),
      email: user.email,
    });

    await webinar.save();

    // Send email (wrapped in try/catch to not block success)
    try {
      await transporter.sendMail({
        from: `"Webinar Team" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: `Registration Confirmed: ${webinar.title}`,
        html: mailHtml(webinar),
      });
    } catch (emailError) {
      console.error("Email failed:", emailError);
    }

    return NextResponse.json({ message: "Registered successfully" }, { status: 200 });

  } catch (err) {
    console.error("Registration Error:", err);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}