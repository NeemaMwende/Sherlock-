// app/admin/reports/page.tsx
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
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const reports = [
    {
      title: "User Activity Report",
      description: "Detailed user login and activity metrics",
      icon: FileText,
      period: "Last 30 days",
    },
    {
      title: "Growth Report",
      description: "User registration and growth trends",
      icon: Calendar,
      period: "Monthly",
    },
    {
      title: "System Usage Report",
      description: "System resource usage and performance",
      icon: FileText,
      period: "Last 7 days",
    },
  ];

  return (
    <AdminDashboardLayout
      userName={session.user?.name || "Admin"}
      userEmail={session.user?.email || ""}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download system reports
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, index) => {
            const Icon = report.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {report.period}
                    </span>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
