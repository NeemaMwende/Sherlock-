// components/admin/RecentLoginsCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecentLogin } from "@/types/db";

interface RecentLoginsCardProps {
  logins: RecentLogin[];
}

export default function RecentLoginsCard({ logins }: RecentLoginsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Logins</CardTitle>
        <CardDescription>Latest user activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logins.map((login, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div>
                <p className="font-medium text-sm">{login.name}</p>
                <p className="text-xs text-muted-foreground">{login.email}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(login.last_login).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
