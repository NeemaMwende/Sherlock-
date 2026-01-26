"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Scale,
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  userName: string;
  userEmail: string;
  isAdmin?: boolean;
  children: React.ReactNode;
}

export default function DashboardLayout({
  userName,
  userEmail,
  isAdmin = false,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const userMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/app/dashboard/dashboard",
    },
    { name: "Cases", icon: FileText, href: "/dashboard/cases" },
    { name: "Clients", icon: Briefcase, href: "/dashboard/clients" },
    { name: "Research", icon: MessageSquare, href: "/dashboard/research" },
    { name: "Security", icon: Settings, href: "/dashboard/security" },
  ];

  const adminMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/" },
    { name: "Users", icon: Users, href: "/admin/users" },
    { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
    { name: "Logs", icon: FileText, href: "/admin/logs" },
    { name: "Reports", icon: BarChart3, href: "/admin/reports" },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b sticky top-0 z-40 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <Scale className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-primary">Sherlock</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r transition-all duration-300 flex-shrink-0 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="space-y-1 px-3">
              {menuItems.map((item) => (
                <Link key={item.name} href={item.href} className="block">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActiveRoute(item.href)
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : ""
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${sidebarOpen ? "mr-3" : ""}`}
                    />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-3 border-t flex-shrink-0">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className={`h-5 w-5 ${sidebarOpen ? "mr-3" : ""}`} />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <aside
              className="w-64 h-full bg-white flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Scale className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    Sherlock
                  </span>
                </div>
              </div>

              <nav className="space-y-1 p-3 flex-1 overflow-y-auto">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        isActiveRoute(item.href)
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : ""
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                ))}
              </nav>

              <div className="p-3 border-t flex-shrink-0">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </Button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
