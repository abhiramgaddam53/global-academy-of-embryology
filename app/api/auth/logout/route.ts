// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { serializeRemoveTokenCookie } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", serializeRemoveTokenCookie());
  return res;
}
export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
  }