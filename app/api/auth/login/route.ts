import { NextResponse } from "next/server";
import { client } from "@/lib/db";
import { comparePassword } from "@/lib/password";
import { loginSchema } from "@/lib/schemas/auth";
import { signJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const res = await client.query(`SELECT * FROM "User" WHERE email=$1`, [
    email,
  ]);
  const user = res.rows[0];
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  const valid = await comparePassword(password, user.password);
  if (!valid)
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });

  const token = signJwt({ id: user.id, role: user.role });

  return NextResponse.json({ success: true, token });
}
