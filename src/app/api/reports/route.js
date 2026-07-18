import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "../../../lib/db";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.execute({
      sql: "SELECT * FROM reports WHERE user_email = ? ORDER BY created_at DESC",
      args: [session.user.email]
    });
    return NextResponse.json({ reports: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
