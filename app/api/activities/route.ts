// app/api/activities/route.ts

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

    /* -------------------- FETCH LATEST 10 ACTIVITIES -------------------- */
    const activities = await sql`
      SELECT 
        a.id,
        a.action,
        a.user_id,
        a.case_id,
        a.metadata,
        a.created_at,
        c.id AS case_id,
        c.name AS case_name
      FROM activities a
      LEFT JOIN cases c ON c.id = a.case_id
      WHERE a.user_id = ${userId}
      ORDER BY a.created_at DESC
      LIMIT 10
    `;

    /* -------------------- FORMAT RESPONSE -------------------- */
    const formattedActivities = activities.map((act) => ({
      id: act.id,
      action: act.action,
      userId: act.user_id,
      caseId: act.case_id,
      metadata: act.metadata,
      createdAt: act.created_at,
      case: act.case_id ? { id: act.case_id, name: act.case_name } : null,
    }));

    return NextResponse.json(formattedActivities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
