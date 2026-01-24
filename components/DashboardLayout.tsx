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

  const userMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "#" },
    { name: "Documents", icon: FileText, href: "#" },
    { name: "Cases", icon: Briefcase, href: "#" },
    { name: "Messages", icon: MessageSquare, href: "#" },
  ];

  const adminMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "#" },
    { name: "Users", icon: Users, href: "#" },
    { name: "Analytics", icon: BarChart3, href: "#" },
    { name: "Settings", icon: Settings, href: "#" },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b sticky top-0 z-40">
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

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="flex-1 py-6">
            <nav className="space-y-1 px-3">
              {menuItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Button>
              ))}
            </nav>
          </div>

          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-5 w-5 mr-3" />
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
              className="w-64 h-full bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <Scale className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    Sherlock
                  </span>
                </div>
              </div>

              <nav className="space-y-1 p-3">
                {menuItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Button>
                ))}
              </nav>

              <div className="absolute bottom-0 w-full p-3 border-t">
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
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
