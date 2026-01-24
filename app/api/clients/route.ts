import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  const clients = await sql`
    SELECT id, full_name, email, active_cases, created_at
    FROM clients
    ORDER BY created_at DESC
  `;

  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const { full_name, email, active_cases } = await req.json();

  await sql`
    INSERT INTO clients (full_name, email, active_cases)
    VALUES (${full_name}, ${email}, ${active_cases})
  `;

  return NextResponse.json({ success: true });
}
