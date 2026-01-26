import sql from "@/lib/db";

export async function GET() {
  try {
    const result = await sql`SELECT 1 as test`;
    return Response.json({ status: "ok", db: "connected" });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        db: "disconnected",
        message: error instanceof Error ? error.message : "unknown error",
      },
      { status: 500 },
    );
  }
}
