// app/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import ActiveCasesList from "@/components/dashboard/ActiveCasesList";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <DashboardLayout
      userName={session.user?.name || "User"}
      userEmail={session.user?.email || ""}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Here is what is happening with your cases
          </p>
        </div>

        <StatsCards />

        <div className="grid gap-4 md:grid-cols-2">
          <ActiveCasesList />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}
