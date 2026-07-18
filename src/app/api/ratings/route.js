import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "../../../lib/db";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { doctor_name, rating, comment } = await req.json();
    
    if (!doctor_name || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.execute({
      sql: "INSERT INTO reviews (user_email, user_name, doctor_name, rating, comment) VALUES (?, ?, ?, ?, ?)",
      args: [session.user.email, session.user.name, doctor_name, rating, comment || ""]
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const result = await db.execute("SELECT * FROM reviews ORDER BY created_at DESC");
    return NextResponse.json({ reviews: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
