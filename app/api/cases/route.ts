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

    // Fetch cases with client information
    const cases = await sql`
      SELECT 
        cases.id,
        cases.name,
        cases.description,
        cases.user_id,
        cases.priority,
        cases.status,
        cases.created_at,
        cases.updated_at,
        clients.full_name AS user_name
      FROM cases
      LEFT JOIN clients ON cases.user_id = clients.id
      ORDER BY cases.created_at DESC
    `;

    return NextResponse.json(cases, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch cases",
        details: error instanceof Error ? error.message : "Unknown error",
      },
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
    console.log("Received payload:", body);

    const { name, description, user_id, priority, status } = body;

    // Validate required fields
    if (!name || !description || !user_id) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "name, description, and user_id are required",
        },
        { status: 400 },
      );
    }

    // Validate priority
    if (!["High", "Medium", "Low"].includes(priority)) {
      return NextResponse.json(
        {
          error: "Invalid priority",
          details: "Priority must be High, Medium, or Low",
        },
        { status: 400 },
      );
    }

    // Validate status
    if (
      !["Pending", "In Progress", "Completed", "Cancelled"].includes(status)
    ) {
      return NextResponse.json(
        {
          error: "Invalid status",
          details:
            "Status must be Pending, In Progress, Completed, or Cancelled",
        },
        { status: 400 },
      );
    }

    // Verify client exists
    const clientExists = await sql`
      SELECT id FROM clients WHERE id = ${user_id}
    `;

    if (clientExists.length === 0) {
      return NextResponse.json(
        {
          error: "Client not found",
          details: `No client found with ID ${user_id}`,
        },
        { status: 404 },
      );
    }

    // Insert the case
    const inserted = await sql`
      INSERT INTO cases (
        name,
        description,
        user_id,
        priority,
        status,
        created_at,
        updated_at
      )
      VALUES (
        ${name},
        ${description},
        ${user_id},
        ${priority},
        ${status},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    if (inserted.length === 0) {
      throw new Error("Failed to insert case");
    }

    console.log("Case inserted:", inserted[0]);

    // Fetch the complete case with client information
    const completeCase = await sql`
      SELECT 
        cases.id,
        cases.name,
        cases.description,
        cases.user_id,
        cases.priority,
        cases.status,
        cases.created_at,
        cases.updated_at,
        clients.full_name AS user_name
      FROM cases
      LEFT JOIN clients ON cases.user_id = clients.id
      WHERE cases.id = ${inserted[0].id}
    `;

    return NextResponse.json(completeCase[0], { status: 201 });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      {
        error: "Failed to create case",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, user_id, priority, status } = body as {
      id: number;
      name?: string;
      description?: string;
      user_id?: number;
      priority?: "High" | "Medium" | "Low";
      status?: "Pending" | "In Progress" | "Completed" | "Cancelled";
    };

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Case ID is required" },
        { status: 400 },
      );
    }

    // Build typed update values
    type CaseUpdateValues = {
      name?: string | null;
      description?: string | null;
      user_id?: number | null;
      priority?: "High" | "Medium" | "Low" | null;
      status?: "Pending" | "In Progress" | "Completed" | "Cancelled" | null;
    };

    const values: CaseUpdateValues = {};

    if (name !== undefined) values.name = name;
    if (description !== undefined) values.description = description;
    if (user_id !== undefined) values.user_id = user_id;
    if (priority !== undefined) {
      if (!["High", "Medium", "Low"].includes(priority)) {
        return NextResponse.json(
          { error: "Invalid priority" },
          { status: 400 },
        );
      }
      values.priority = priority;
    }
    if (status !== undefined) {
      if (
        !["Pending", "In Progress", "Completed", "Cancelled"].includes(status)
      ) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      values.status = status;
    }

    if (Object.keys(values).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    // Update the case
    const updated = await sql`
      UPDATE cases
      SET 
        name = COALESCE(${values.name ?? null}, name),
        description = COALESCE(${values.description ?? null}, description),
        user_id = COALESCE(${values.user_id ?? null}, user_id),
        priority = COALESCE(${values.priority ?? null}, priority),
        status = COALESCE(${values.status ?? null}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Fetch complete case with user information
    const completeCase = await sql`
      SELECT 
        cases.id,
        cases.name,
        cases.description,
        cases.user_id,
        cases.priority,
        cases.status,
        cases.created_at,
        cases.updated_at,
        users.name AS user_name,
        users.email AS user_email
      FROM cases
      LEFT JOIN users ON cases.user_id = users.id
      WHERE cases.id = ${id}
    `;

    return NextResponse.json(completeCase[0]);
  } catch (error) {
    console.error("Error updating case:", error);
    return NextResponse.json(
      {
        error: "Failed to update case",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Case ID is required" },
        { status: 400 },
      );
    }

    const deleted = await sql`
      DELETE FROM cases
      WHERE id = ${id}
      RETURNING id
    `;

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Case deleted successfully",
      id: deleted[0].id,
    });
  } catch (error) {
    console.error("Error deleting case:", error);
    return NextResponse.json(
      {
        error: "Failed to delete case",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
