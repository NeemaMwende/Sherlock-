import { NextResponse } from "next/server";
import { client } from "@/lib/db";

export default async function GET() {
  const res = await client.query(
    `SELECT * FROM "UserActivity" ORDER BY event_time DESC LIMIT 50`,
  );
  return NextResponse.json(res.rows);
}
