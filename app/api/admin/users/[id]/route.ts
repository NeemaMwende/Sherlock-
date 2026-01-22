// app/api/admin/users/[id]/route.ts
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

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email, role } = await request.json();
    const userId = parseInt(params.id);

    if (!name || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if email is already taken by another user
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} AND id != ${userId}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 },
      );
    }

    const [updatedUser] = await sql`
      UPDATE users 
      SET name = ${name}, email = ${email}, role = ${role}
      WHERE id = ${userId}
      RETURNING id, name, email, role, created_at, last_login
    `;

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);

    // Prevent admin from deleting themselves
    if (session.user?.id === userId.toString()) {
      return NextResponse.json(
        { message: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    const result = await sql`
      DELETE FROM users WHERE id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
