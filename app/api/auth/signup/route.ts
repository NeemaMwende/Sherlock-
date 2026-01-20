import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { signupSchema } from "@/lib/validations";
import { signupRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // identify the client (IP based)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      req.headers.get("x-real-ip") ??
      "anonymous";

    //rate limit check
    const { success, reset } = await signupRateLimit.limit(`signup:${ip}`);
    if (!success) {
      return NextResponse.json(
        {
          message: "Too many signup attempts. Please try again later",
        },
        {
          status: 429,
          headers: {
            "Retry-After": reset.toString(),
          },
        },
      );
    }

    //parse and validate request
    const body = await req.json();
    const { name, email, password } = signupSchema.parse(body);

    //check if user exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //insert user
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, 'user')
    `;

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 },
    );
  }
}
