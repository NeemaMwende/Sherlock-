// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";
import StatsCards from "@/components/admin/StatsCards";
import RecentLoginsCard from "@/components/admin/RecentLoginsCard";
import QuickActionsCard from "@/components/admin/QuickActionsCard";
import UserManagementTable from "@/components/admin/UserManagementTable";
import sql from "@/lib/db";
import { UserRow, RecentLogin } from "@/types/db";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const users = (await sql`
    SELECT id, name, email, role, created_at, last_login 
    FROM users 
    ORDER BY created_at DESC
    LIMIT 10
  `) as UserRow[];

  const stats = await sql`
    SELECT 
      COUNT(*) as total_users,
      COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
      COUNT(CASE WHEN last_login > NOW() - INTERVAL '7 days' THEN 1 END) as active_users,
      COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users
    FROM users
  `;

  const recentLogins = (await sql`
    SELECT name, email, last_login 
    FROM users 
    WHERE last_login IS NOT NULL 
    ORDER BY last_login DESC 
    LIMIT 5
  `) as RecentLogin[];

  return (
    <AdminDashboardLayout
      userName={session.user?.name || "Admin"}
      userEmail={session.user?.email || ""}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users and monitor system activity
          </p>
        </div>

        <StatsCards stats={stats[0]} />

        <div className="grid gap-4 md:grid-cols-2">
          <RecentLoginsCard logins={recentLogins} />
          <QuickActionsCard />
        </div>

        <UserManagementTable users={users} />
      </div>
    </AdminDashboardLayout>
  );
}
