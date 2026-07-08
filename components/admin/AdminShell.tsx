"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/admin/quotes", label: "Quotations", icon: FileText },
  { href: "/admin/meetings", label: "Meetings", icon: Calendar },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#030303]">
      <aside className="hidden w-64 flex-col border-r border-white/[0.06] bg-black/40 p-6 lg:flex">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black text-sm font-bold">
            L
          </div>
          <span className="font-semibold text-sm">LuvaTech Admin</span>
        </Link>

        <nav className="mt-10 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/[0.06] pt-4">
          <p className="text-xs text-white/40">{userName}</p>
          <form action="/admin/logout" method="POST">
            <button
              type="submit"
              className="mt-2 flex items-center gap-2 text-xs text-white/50 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="border-b border-white/[0.06] px-6 py-4 lg:hidden">
          <p className="text-sm font-medium">LuvaTech Admin</p>
        </div>
        <div className="p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
