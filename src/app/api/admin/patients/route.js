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
    const result = await db.execute("SELECT id, name, email, phone, role FROM users WHERE role = 'user'");
    return NextResponse.json({ patients: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
