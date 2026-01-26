// app/admin/users/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";
import UserManagementTable from "@/components/admin/UserManagementTable";
import sql from "@/lib/db";
import { UserRow } from "@/types/db";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const users = (await sql`
    SELECT id, name, email, role, created_at, last_login 
    FROM users 
    ORDER BY created_at DESC
  `) as UserRow[];

  return (
    <AdminDashboardLayout
      userName={session.user?.name || "Admin"}
      userEmail={session.user?.email || ""}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all user accounts and permissions
          </p>
        </div>

        <UserManagementTable users={users} />
      </div>
    </AdminDashboardLayout>
  );
}
