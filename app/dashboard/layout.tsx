import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <DashboardLayout
      userName={session.user?.name || "User"}
      userEmail={session.user?.email || ""}
    >
      {children}
    </DashboardLayout>
  );
}
