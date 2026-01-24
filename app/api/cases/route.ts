import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cases = await sql`
      SELECT 
        c.id,
        c.case_number,
        c.title,
        c.description,
        c.client_id,
        c.priority,
        c.status,
        c.due_date,
        c.created_at,
        cl.full_name AS client_name
      FROM cases c
      LEFT JOIN clients cl ON c.client_id = cl.id
      ORDER BY c.created_at DESC
    `;

    // 🔑 IMPORTANT: Neon already returns an array
    return NextResponse.json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch cases" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, client_id, priority, status, due_date } =
      await request.json();

    // Generate case number: CASE-YYYY-XXXX
    const year = new Date().getFullYear();

    const countResult = await sql`
      SELECT COUNT(*)::int AS count
      FROM cases
      WHERE EXTRACT(YEAR FROM created_at) = ${year}
    `;

    const count = countResult[0].count + 1;

    const case_number = `CASE-${year}-${String(count).padStart(4, "0")}`;

    const inserted = await sql`
      INSERT INTO cases (
        case_number,
        title,
        description,
        client_id,
        priority,
        status,
        due_date
      )
      VALUES (
        ${case_number},
        ${title},
        ${description},
        ${client_id},
        ${priority},
        ${status},
        ${due_date}
      )
      RETURNING *
    `;

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 },
    );
  }
}
