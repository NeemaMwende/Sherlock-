// components/dashboard/ActiveCasesList.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Case {
  id: string;
  name: string;
  status: string;
  priority: string;
  _count: {
    documents: number;
    messages: number;
  };
}

export default function ActiveCasesList() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch("/api/cases");
      if (!response.ok) throw new Error("Failed to fetch cases");
      const data = await response.json();
      setCases(data.filter((c: Case) => c.status !== "Closed"));
    } catch (error) {
      console.error("Error fetching cases:", error);
      toast.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  const handleCaseClick = (caseId: string) => {
    router.push(`/dashboard/cases/${caseId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Cases</CardTitle>
          <CardDescription>Your ongoing legal matters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div className="flex-1">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Cases</CardTitle>
        <CardDescription>Your ongoing legal matters</CardDescription>
      </CardHeader>
      <CardContent>
        {cases.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No active cases yet
          </p>
        ) : (
          <div className="space-y-4">
            {cases.map((caseItem) => (
              <div
                key={caseItem.id}
                onClick={() => handleCaseClick(caseItem.id)}
                className="flex items-center justify-between border-b pb-3 last:border-0 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors"
              >
                <div>
                  <p className="font-medium">{caseItem.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {caseItem.status} • {caseItem._count.documents} docs •{" "}
                    {caseItem._count.messages} messages
                  </p>
                </div>
                <Badge
                  variant={
                    caseItem.priority === "High"
                      ? "destructive"
                      : caseItem.priority === "Medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {caseItem.priority}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
