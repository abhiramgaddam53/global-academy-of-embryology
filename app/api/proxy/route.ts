import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing URL', { status: 400 });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");

    const blob = await response.blob();
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "image/jpeg");
    
    // crucial for canvas
    headers.set("Access-Control-Allow-Origin", "*"); 
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(blob, { headers });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new NextResponse('Error', { status: 500 });
  }
}