import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import db from "../../../../lib/db";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "admin" && session.user.role !== "staff")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.execute("SELECT * FROM reports ORDER BY created_at DESC");
    return NextResponse.json({ reports: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "admin" && session.user.role !== "staff")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { user_email, title, doctor_name, content_or_link } = await req.json();
    
    if (!user_email || !title || !content_or_link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.execute({
      sql: "INSERT INTO reports (user_email, title, doctor_name, content_or_link) VALUES (?, ?, ?, ?)",
      args: [user_email, title, doctor_name || session.user.name, content_or_link]
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to create report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
