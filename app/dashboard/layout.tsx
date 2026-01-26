import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protect dashboard routes
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <DashboardLayout
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      isAdmin={session.user.role === "admin"}
    >
      {children}
    </DashboardLayout>
  );
}
