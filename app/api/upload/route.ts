import { NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { verifyToken } from "@/lib/auth"; // Ensure this path is correct
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // 1. Verify Admin
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME || "token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // You can also use your verifyAdmin helper here if you prefer
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // 2. Parse Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    // Read the folder name from the client, default to 'Webinar-photos' if missing
    const folder = (formData.get("folder") as string) || "Webinar-photos";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validation
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // 4. Processing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // const fileType = file.type.split("/")[1];
    const fileType = file.type === "application/pdf" ? "pdf" : file.type.split("/")[1];

    // 5. Upload with Dynamic Folder
    const url = await uploadToS3(buffer, fileType, folder);

    return NextResponse.json({ url }, { status: 200 });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}