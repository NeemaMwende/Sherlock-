// components/admin/AdminDashboardLayout.tsx
"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

export default function AdminDashboardLayout({
  children,
  userName,
  userEmail,
}: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          userName={userName}
          userEmail={userEmail}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
