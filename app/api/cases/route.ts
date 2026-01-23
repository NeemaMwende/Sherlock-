// app/api/cases/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* -------------------- GET USER -------------------- */
    const users = await sql`
      SELECT id
      FROM users
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = users[0].id as number;

    /* -------------------- FETCH CASES -------------------- */
    const cases = await sql`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.status,
        c.priority,
        c.user_id,
        c.created_at,
        c.updated_at,
        -- Count related documents
        (SELECT COUNT(*) FROM documents d WHERE d.case_id = c.id) AS documents_count,
        -- Count related messages
        (SELECT COUNT(*) FROM messages m WHERE m.case_id = c.id) AS messages_count
      FROM cases c
      WHERE c.user_id = ${userId}
      ORDER BY c.updated_at DESC
    `;

    return NextResponse.json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* -------------------- GET USER -------------------- */
    const users = await sql`
      SELECT id
      FROM users
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = users[0].id as number;

    const body = await request.json();
    const { name, description, priority } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Case name is required" },
        { status: 400 },
      );
    }

    /* -------------------- CREATE CASE -------------------- */
    const newCases = await sql`
      INSERT INTO cases (name, description, priority, user_id, created_at, updated_at)
      VALUES (${name}, ${description || null}, ${priority || "Medium"}, ${userId}, NOW(), NOW())
      RETURNING *
    `;

    const newCase = newCases[0];

    /* -------------------- LOG ACTIVITY -------------------- */
    await sql`
      INSERT INTO activities (action, case_id, user_id, metadata, created_at)
      VALUES (
        'Case created',
        ${newCase.id},
        ${userId},
        ${JSON.stringify({ caseName: name })}::jsonb,
        NOW()
      )
    `;

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
