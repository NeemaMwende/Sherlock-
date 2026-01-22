// components/admin/QuickActionsCard.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Download, FileText, BarChart } from "lucide-react";

export default function QuickActionsCard() {
  const router = useRouter();

  const actions = [
    {
      label: "Add New User",
      icon: UserPlus,
      onClick: () => router.push("/admin/users?action=add"),
    },
    {
      label: "Export User Data",
      icon: Download,
      onClick: () => router.push("/admin/users?action=export"),
    },
    {
      label: "View System Logs",
      icon: FileText,
      onClick: () => router.push("/admin/logs"),
    },
    {
      label: "Generate Reports",
      icon: BarChart,
      onClick: () => router.push("/admin/reports"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              className="w-full justify-start"
              variant="outline"
              onClick={action.onClick}
            >
              <Icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
