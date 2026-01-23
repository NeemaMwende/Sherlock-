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
    const userId = params.id; // ⬅️ NO parseInt

    if (!name || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingUser = await sql`
      SELECT id FROM users
      WHERE email = ${email} AND id != ${userId}
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // ✅ unwrap params
    const userId = Number(id);

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // ✅ Prevent admin from deleting themselves (email-based)
    const self = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `;

    if (self.length > 0 && self[0].id === userId) {
      return NextResponse.json(
        { message: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    const result = await sql`
      DELETE FROM users
      WHERE id = ${userId}
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
