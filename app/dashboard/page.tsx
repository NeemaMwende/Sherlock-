"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main page where the actual dashboard is
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="h-full flex items-center justify-center">
      <Card className="border-black">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
