// app/api/cases/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
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

    /* -------------------- GET CASE -------------------- */
    const cases = await sql`
      SELECT *
      FROM cases
      WHERE id = ${params.id}
      LIMIT 1
    `;
    if (cases.length === 0) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const caseData = cases[0];

    if (caseData.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* -------------------- GET DOCUMENTS -------------------- */
    const documents = await sql`
      SELECT *
      FROM documents
      WHERE case_id = ${params.id}
      ORDER BY created_at DESC
    `;

    /* -------------------- GET MESSAGES -------------------- */
    const messages = await sql`
      SELECT *
      FROM messages
      WHERE case_id = ${params.id}
      ORDER BY created_at DESC
    `;

    /* -------------------- GET LATEST 10 ACTIVITIES -------------------- */
    const activities = await sql`
      SELECT a.id, a.action, a.user_id, a.metadata, a.created_at,
             c.id AS case_id, c.name AS case_name
      FROM activities a
      LEFT JOIN cases c ON c.id = a.case_id
      WHERE a.case_id = ${params.id}
      ORDER BY a.created_at DESC
      LIMIT 10
    `;

    const formattedActivities = activities.map((act) => ({
      id: act.id,
      action: act.action,
      userId: act.user_id,
      metadata: act.metadata,
      createdAt: act.created_at,
      case: act.case_id ? { id: act.case_id, name: act.case_name } : null,
    }));

    return NextResponse.json({
      ...caseData,
      documents,
      messages,
      activities: formattedActivities,
    });
  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
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

    /* -------------------- GET CASE -------------------- */
    const cases = await sql`
      SELECT *
      FROM cases
      WHERE id = ${params.id}
      LIMIT 1
    `;
    if (cases.length === 0) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const caseData = cases[0];
    if (caseData.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* -------------------- UPDATE CASE -------------------- */
    const body = await request.json();
    const { name, description, status, priority } = body;

    const setClauses: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      setClauses.push(`name = $${setClauses.length + 1}`);
      values.push(name);
    }
    if (description !== undefined) {
      setClauses.push(`description = $${setClauses.length + 1}`);
      values.push(description);
    }
    if (status !== undefined) {
      setClauses.push(`status = $${setClauses.length + 1}`);
      values.push(status);
    }
    if (priority !== undefined) {
      setClauses.push(`priority = $${setClauses.length + 1}`);
      values.push(priority);
    }

    let updatedCase = caseData;

    if (setClauses.length > 0) {
      const query = `
        UPDATE cases
        SET ${setClauses.join(", ")}, updated_at = NOW()
        WHERE id = $${setClauses.length + 1}
        RETURNING *
      `;
      values.push(params.id);

      const result = await sql.query(query, values);
      updatedCase = result[0];
    }

    /* -------------------- LOG ACTIVITY -------------------- */
    await sql`
      INSERT INTO activities (action, case_id, user_id, metadata, created_at)
      VALUES (
        'Case updated',
        ${params.id},
        ${userId},
        ${JSON.stringify({ caseName: updatedCase.name })}::jsonb,
        NOW()
      )
    `;

    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error("Error updating case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
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

    /* -------------------- GET CASE -------------------- */
    const cases = await sql`
      SELECT *
      FROM cases
      WHERE id = ${params.id}
      LIMIT 1
    `;
    if (cases.length === 0) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const caseData = cases[0];
    if (caseData.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* -------------------- DELETE CASE -------------------- */
    await sql`
      DELETE FROM cases
      WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
