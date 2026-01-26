import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, Users, Activity, Eye } from "lucide-react";
import sql from "@/lib/db";
import UserGrowthChart from "@/components/admin/UserGrowthChart";

type UserGrowthPoint = {
  month: string;
  users: number;
};

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  /* -------------------- DATABASE QUERIES -------------------- */

  // Run critical metrics first (less load)
  const pageViewsRes = await sql`
    SELECT COUNT(*)::int AS count FROM page_views
  `;

  const activeSessionsRes = await sql`
    SELECT COUNT(*)::int AS count
    FROM sessions
    WHERE active = true
  `;

  const newSignupsRes = await sql`
    SELECT COUNT(*)::int AS count
    FROM users
    WHERE created_at >= NOW() - INTERVAL '7 days'
  `;

  const conversionRateRes = await sql`
    SELECT
      ROUND(
        (COUNT(*) FILTER (WHERE converted = true)::decimal
        / NULLIF(COUNT(*), 0)) * 100,
        1
      ) AS rate
    FROM visitors
  `;

  const userGrowthRaw = await sql`
    SELECT
      TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
      COUNT(*)::int AS users
    FROM users
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at)
  `;

  /* -------------------- SAFE EXTRACTION -------------------- */

  const pageViews = Number(pageViewsRes[0]?.count ?? 0);
  const activeSessions = Number(activeSessionsRes[0]?.count ?? 0);
  const newSignups = Number(newSignupsRes[0]?.count ?? 0);
  const conversionRate = Number(conversionRateRes[0]?.rate ?? 0);

  // Explicit mapping → fixes TS error
  const userGrowthData: UserGrowthPoint[] = userGrowthRaw.map((row) => ({
    month: String(row.month),
    users: Number(row.users),
  }));

  /* -------------------- UI -------------------- */

  return (
    <AdminDashboardLayout
      userName={session.user?.name || "Admin"}
      userEmail={session.user?.email || ""}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights and metrics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Metric title="Page Views" value={pageViews} icon={<Eye />} />
          <Metric
            title="Active Sessions"
            value={activeSessions}
            icon={<Activity />}
          />
          <Metric title="New Signups" value={newSignups} icon={<Users />} />
          <Metric
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon={<TrendingUp />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <UserGrowthChart data={userGrowthData} />
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}

/* -------------------- Small Metric Component -------------------- */

function Metric({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
