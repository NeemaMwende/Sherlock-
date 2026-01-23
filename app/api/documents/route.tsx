// app/api/documents/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID
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

    // Optional caseId filter
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("caseId");

    // Fetch documents
    const documents = await sql`
      SELECT d.*, c.id AS case_id, c.name AS case_name
      FROM documents d
      LEFT JOIN cases c ON c.id = d.case_id
      WHERE d.user_id = ${userId}
      ${caseId ? sql`AND d.case_id = ${caseId}` : sql``}
      ORDER BY d.created_at DESC
    `;

    // Format documents with nested case info
    const formattedDocuments = documents.map((doc) => ({
      ...doc,
      case: doc.case_id ? { id: doc.case_id, name: doc.case_name } : null,
    }));

    return NextResponse.json(formattedDocuments);
  } catch (error) {
    console.error("Error fetching documents:", error);
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

    // Get user ID
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
    const { name, fileUrl, fileSize, fileType, caseId } = body;

    if (!name || !fileUrl || !fileSize || !fileType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert document
    const newDocs = await sql`
      INSERT INTO documents (name, file_url, file_size, file_type, case_id, user_id, created_at)
      VALUES (${name}, ${fileUrl}, ${fileSize}, ${fileType}, ${caseId || null}, ${userId}, NOW())
      RETURNING *
    `;
    const newDocument = newDocs[0];

    // Log activity
    await sql`
      INSERT INTO activities (action, case_id, user_id, metadata, created_at)
      VALUES (
        'Document uploaded',
        ${caseId || null},
        ${userId},
        ${JSON.stringify({ documentName: name })}::jsonb,
        NOW()
      )
    `;

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID
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

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");
    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 },
      );
    }

    // Fetch document to validate ownership
    const docs = await sql`
      SELECT *
      FROM documents
      WHERE id = ${documentId}
      LIMIT 1
    `;
    if (docs.length === 0) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const document = docs[0];
    if (document.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete document
    await sql`
      DELETE FROM documents
      WHERE id = ${documentId}
    `;

    // Log activity
    await sql`
      INSERT INTO activities (action, case_id, user_id, metadata, created_at)
      VALUES (
        'Document deleted',
        ${document.case_id || null},
        ${userId},
        ${JSON.stringify({ documentName: document.name })}::jsonb,
        NOW()
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
