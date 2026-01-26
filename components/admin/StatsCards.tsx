// components/admin/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, TrendingUp, Activity } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total_users: number;
    admin_count: number;
    active_users: number;
    new_users: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.total_users,
      description: `+${stats.new_users} this month`,
      icon: Users,
    },
    {
      title: "Active Users",
      value: stats.active_users,
      description: "Last 7 days",
      icon: UserCheck,
    },
    {
      title: "Administrators",
      value: stats.admin_count,
      description: "System admins",
      icon: Activity,
    },
    {
      title: "Growth Rate",
      value: "+12%",
      description: "vs last month",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
