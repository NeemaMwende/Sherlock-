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

    const cases = await sql(
      `SELECT 
        c.*,
        cl.full_name as client_name
      FROM cases c
      LEFT JOIN clients cl ON c.client_id = cl.id
      ORDER BY c.created_at DESC`,
    );

    return NextResponse.json(cases.rows);
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

    const body = await request.json();
    const { title, description, client_id, priority, status, due_date } = body;

    // Generate case number (format: CASE-YYYY-XXXX)
    const year = new Date().getFullYear();
    const countResult = await sql(
      "SELECT COUNT(*) as count FROM cases WHERE EXTRACT(YEAR FROM created_at) = $1",
      [year],
    );
    const count = parseInt(countResult.rows[0].count) + 1;
    const case_number = `CASE-${year}-${String(count).padStart(4, "0")}`;

    const result = await sql(
      `INSERT INTO cases (case_number, title, description, client_id, priority, status, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [case_number, title, description, client_id, priority, status, due_date],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 },
    );
  }
}
