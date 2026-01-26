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
  pendingCases: number;
};

type Case = {
  id: number;
  name: string;
  description: string;
  user_name: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
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
    pendingCases: 0,
  });
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [inProgressCases, setInProgressCases] = useState<Case[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const casesRes = await fetch("/api/cases");
        const casesData = await casesRes.json();

        const clientsRes = await fetch("/api/clients");
        const clientsData = await clientsRes.json();

        const casesArray = Array.isArray(casesData) ? casesData : [];
        const clientsArray = Array.isArray(clientsData) ? clientsData : [];

        const activeCases = casesArray.filter(
          (c: Case) => c.status === "In Progress",
        ).length;

        const highPriority = casesArray.filter(
          (c: Case) => c.priority === "High",
        ).length;

        const pending = casesArray.filter(
          (c: Case) => c.status === "Pending",
        ).length;

        setStats({
          totalCases: casesArray.length,
          activeCases,
          totalClients: clientsArray.length,
          highPriorityCases: highPriority,
          pendingCases: pending,
        });

        setRecentCases(casesArray.slice(0, 5));
        setInProgressCases(
          casesArray
            .filter((c: Case) => c.status === "In Progress")
            .slice(0, 5),
        );
        setRecentClients(clientsArray.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []); // ✅ empty deps

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
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

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const createdDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
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
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCases}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
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
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingCases}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* In Progress Cases */}
        <Card className="border-black">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Cases In Progress</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {inProgressCases.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No active cases
              </p>
            ) : (
              <div className="space-y-4">
                {inProgressCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{caseItem.name}</p>
                      <p className="text-sm text-muted-foreground">
                        #{caseItem.id} • {caseItem.user_name}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <Badge
                        variant="outline"
                        className={getPriorityColor(caseItem.priority)}
                      >
                        {caseItem.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
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
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Assigned User</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
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
                        #{caseItem.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{caseItem.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {caseItem.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{caseItem.user_name}</TableCell>
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
                          {caseItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{getTimeAgo(caseItem.updated_at)}</TableCell>
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
