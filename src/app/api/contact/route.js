import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await db.execute({
      sql: "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)",
      args: [name, email, phone, message]
    });

    return NextResponse.json({ success: true, message: "Your message has been sent successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
