"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Users,
  AlertCircle,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type DashboardStats = {
  totalCases: number;
  activeCases: number;
  totalClients: number;
  highPriorityCases: number;
  upcomingDeadlines: number;
};

type Case = {
  id: number;
  case_number: string;
  title: string;
  client_name: string;
  priority: string;
  status: string;
  due_date: string;
};

type Client = {
  id: number;
  full_name: string;
  email: string;
  active_cases: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCases: 0,
    activeCases: 0,
    totalClients: 0,
    highPriorityCases: 0,
    upcomingDeadlines: 0,
  });
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [upcomingCases, setUpcomingCases] = useState<Case[]>([]);

  const fetchDashboardData = async () => {
    try {
      // Fetch cases
      const casesRes = await fetch("/api/cases");
      const casesData = await casesRes.json();

      // Fetch clients
      const clientsRes = await fetch("/api/clients");
      const clientsData = await clientsRes.json();

      // Calculate stats
      const activeCases = casesData.filter(
        (c: Case) => c.status !== "closed",
      ).length;
      const highPriority = casesData.filter(
        (c: Case) => c.priority === "high",
      ).length;

      // Get upcoming deadlines (within 7 days)
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcoming = casesData.filter((c: Case) => {
        const dueDate = new Date(c.due_date);
        return (
          dueDate >= now && dueDate <= weekFromNow && c.status !== "closed"
        );
      });

      setStats({
        totalCases: casesData.length,
        activeCases,
        totalClients: clientsData.length,
        highPriorityCases: highPriority,
        upcomingDeadlines: upcoming.length,
      });

      setRecentCases(casesData.slice(0, 5));
      setUpcomingCases(upcoming.slice(0, 5));
      setRecentClients(clientsData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (date: string) => {
    const now = new Date();
    const dueDate = new Date(date);
    const days = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return days;
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here is an overview of your legal practice.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCases}</div>
            <p className="text-xs text-muted-foreground">All time cases</p>
          </CardContent>
        </Card>

        <Card className="border-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCases}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Registered clients</p>
          </CardContent>
        </Card>

        <Card className="border-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.highPriorityCases}
            </div>
            <p className="text-xs text-muted-foreground">Urgent cases</p>
          </CardContent>
        </Card>

        <Card className="border-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.upcomingDeadlines}
            </div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="border-black">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Upcoming Deadlines</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {upcomingCases.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No upcoming deadlines
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingCases.map((caseItem) => {
                  const daysUntil = getDaysUntil(caseItem.due_date);
                  return (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{caseItem.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {caseItem.case_number} • {caseItem.client_name}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <Badge
                          variant="outline"
                          className={
                            daysUntil <= 2
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {daysUntil === 0
                            ? "Today"
                            : daysUntil === 1
                              ? "Tomorrow"
                              : `${daysUntil} days`}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card className="border-black">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Recent Clients</CardTitle>
              <Link href="/dashboard/clients">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentClients.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No clients yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{client.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {client.email}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {client.active_cases}{" "}
                      {client.active_cases === 1 ? "case" : "cases"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases Table */}
      <Card className="border-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Recent Cases</CardTitle>
            <Link href="/dashboard/cases">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No cases yet
                    </TableCell>
                  </TableRow>
                ) : (
                  recentCases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell className="font-medium">
                        {caseItem.case_number}
                      </TableCell>
                      <TableCell>{caseItem.title}</TableCell>
                      <TableCell>{caseItem.client_name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(caseItem.priority)}
                        >
                          {caseItem.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(caseItem.status)}
                        >
                          {caseItem.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(caseItem.due_date)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
