// app/api/dashboard/stats/route.ts

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

    /* -------------------- DASHBOARD STATS -------------------- */

    const [
      activeCasesRes,
      totalDocumentsRes,
      unreadMessagesRes,
      pendingDocumentsRes,
      casesNeedingAttentionRes,
    ] = await Promise.all([
      // Active cases
      sql`
        SELECT COUNT(*)::int AS count
        FROM cases
        WHERE user_id = ${userId}
          AND status IN ('In Progress', 'Waiting')
      `,

      // Total documents
      sql`
        SELECT COUNT(*)::int AS count
        FROM documents
        WHERE user_id = ${userId}
      `,

      // Unread messages
      sql`
        SELECT COUNT(*)::int AS count
        FROM messages
        WHERE user_id = ${userId}
          AND is_read = false
      `,

      // Pending documents
      sql`
        SELECT COUNT(*)::int AS count
        FROM documents
        WHERE user_id = ${userId}
          AND status = 'pending'
      `,

      // High-priority cases needing attention
      sql`
        SELECT COUNT(*)::int AS count
        FROM cases
        WHERE user_id = ${userId}
          AND priority = 'High'
          AND status IN ('In Progress', 'Waiting')
      `,
    ]);

    /* -------------------- RESPONSE -------------------- */

    return NextResponse.json({
      activeCases: activeCasesRes[0].count,
      casesNeedingAttention: casesNeedingAttentionRes[0].count,
      totalDocuments: totalDocumentsRes[0].count,
      pendingDocuments: pendingDocumentsRes[0].count,
      unreadMessages: unreadMessagesRes[0].count,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
