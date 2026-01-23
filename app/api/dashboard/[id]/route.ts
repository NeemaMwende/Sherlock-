// app/api/documents/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

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

    /* -------------------- GET DOCUMENT -------------------- */
    const documents = await sql`
      SELECT *
      FROM documents
      WHERE id = ${params.id}
      LIMIT 1
    `;
    if (documents.length === 0) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const document = documents[0];

    /* -------------------- CHECK OWNERSHIP -------------------- */
    if (document.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* -------------------- UPDATE FIELDS -------------------- */
    const body = await request.json();
    const { name, status, caseId } = body;

    // Build dynamic SET clauses
    const setClauses: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      setClauses.push(`name = $${setClauses.length + 1}`);
      values.push(name);
    }
    if (status !== undefined) {
      setClauses.push(`status = $${setClauses.length + 1}`);
      values.push(status);
    }
    if (caseId !== undefined) {
      setClauses.push(`case_id = $${setClauses.length + 1}`);
      values.push(caseId || null);
    }

    let updatedDocument = document;

    if (setClauses.length > 0) {
      const query = `
        UPDATE documents
        SET ${setClauses.join(", ")}, updated_at = NOW()
        WHERE id = $${setClauses.length + 1}
        RETURNING *
      `;
      values.push(params.id);

      const result = await sql.query(query, values);
      updatedDocument = result[0];
    }

    /* -------------------- GET CASE INFO -------------------- */
    if (updatedDocument.case_id) {
      const caseRes = await sql`
        SELECT id, name
        FROM cases
        WHERE id = ${updatedDocument.case_id}
        LIMIT 1
      `;
      updatedDocument.case = caseRes.length
        ? { id: caseRes[0].id, name: caseRes[0].name }
        : null;
    } else {
      updatedDocument.case = null;
    }

    /* -------------------- LOG ACTIVITY -------------------- */
    await sql`
      INSERT INTO activities (action, case_id, user_id, metadata, created_at)
      VALUES (
        'Document updated',
        ${updatedDocument.case_id || null},
        ${userId},
        ${JSON.stringify({ documentName: updatedDocument.name })}::jsonb,
        NOW()
      )
    `;

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
