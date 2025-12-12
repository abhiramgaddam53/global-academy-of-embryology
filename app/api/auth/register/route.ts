import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/app/models/User";

// Strong validation helpers
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidMobile = (mobile: string) =>
  /^[6-9]\d{9}$/.test(mobile); // Indian 10-digit numbers

const isStrongPassword = (password: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

interface RegisterBody {
  name?: string;
  dob?: string;
  qualification?: string;
  designation?: string;
  clinicName?: string;
  address?: string;
  workExp?: string;
  mobile?: string;

  email?: string;
  password?: string;
}

export async function POST(req: Request) {
  console.log("REGISTER ROUTE HIT");

  await connectToDB();

  try {
    const body: RegisterBody = await req.json();

    const {
      name,
      dob,
      qualification,
      designation,
      clinicName,
      address,
      workExp,
      mobile,
      email,
      password,
    } = body;

    // ---------------------------
    // 1. Check missing fields
    // ---------------------------
    const requiredFields = {
      name,
      dob,
      qualification,
      designation,
      clinicName,
      address,
      workExp,
      mobile,
      email,
      password,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || String(value).trim() === "") {
        return NextResponse.json(
          { error: `${key} is required` },
          { status: 400 }
        );
      }
    }

    // ---------------------------
    // 2. Validate data formats
    // ---------------------------

    if (!isValidEmail(email!)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!isValidMobile(mobile!)) {
      return NextResponse.json(
        { error: "Invalid mobile number. Must be 10 digits starting with 6-9" },
        { status: 400 }
      );
    }

    // Validate date (simple format)
    if (isNaN(Date.parse(dob!))) {
      return NextResponse.json(
        { error: "Invalid date of birth format" },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password!)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters and include letters and numbers" },
        { status: 400 }
      );
    }

    // ---------------------------
    // 3. Check duplicates
    // ---------------------------
    const existingByEmail = await User.findOne({ email });
    const existingByMobile = await User.findOne({ mobile });

    if (existingByEmail && existingByMobile) {
      return NextResponse.json(
        { error: "Both email and mobile number already exist. Try logging in." },
        { status: 409 }
      );
    }

    if (existingByEmail) {
      return NextResponse.json(
        { error: "Email already exists. Try logging in with email." },
        { status: 409 }
      );
    }

    if (existingByMobile) {
      return NextResponse.json(
        { error: "Mobile number already exists. Try logging in with mobile." },
        { status: 409 }
      );
    }

    // ---------------------------
    // 4. Create user
    // ---------------------------
    const user = new User({
      name,
      dob,
      qualification,
      designation,
      clinicName,
      address,
      workExp,
      mobile,
      email,
      password,
    });

    await user.save();

    // Remove sensitive fields
    const safeUser = {
      _id: user._id,
      name: user.name,
      dob: user.dob,
      qualification: user.qualification,
      designation: user.designation,
      clinicName: user.clinicName,
      address: user.address,
      workExp: user.workExp,
      mobile: user.mobile,
      email: user.email,
    };

    return NextResponse.json({ user: safeUser }, { status: 201 });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
