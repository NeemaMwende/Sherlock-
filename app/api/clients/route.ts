import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const clients = await sql`
      SELECT id, full_name, email, active_cases, created_at, (CURRENT_DATE - created_at::date) AS days_ago
      FROM clients
      ORDER BY created_at DESC
    `;

    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { full_name, email, active_cases } = await req.json();

    await sql`
      INSERT INTO clients (full_name, email, active_cases)
      VALUES (${full_name}, ${email}, ${active_cases})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 },
    );
  }
}
