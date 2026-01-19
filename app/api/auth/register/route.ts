import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { signupSchema } from "@/lib/schemas/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    //use of parameterized query to prevent SQL injection
    const existing = await pool.query(
      `SELECT id FROM "User" WHERE email = $1`,
      [email],
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 },
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    await pool.query(
      `INSERT INTO "User" (name, email, password) VALUES (gen_random_uuid(), $1, $2, $3)`,
      [name, email, hashedPassword],
    );

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
