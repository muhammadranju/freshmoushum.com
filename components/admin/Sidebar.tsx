"use client";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ChevronLeft,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Packages", href: "/admin/packages", icon: Package },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Homepage CMS", href: "/admin/cms", icon: Home },
  { label: "Delivery", href: "/admin/delivery", icon: Truck },
  { label: "WhatsApp", href: "/admin/whatsapp", icon: MessageSquare },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-screen sticky top-0 bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col border-r border-slate-800 z-50",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="/fresh_moushum_logo.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-white text-lg truncate">
              Fresh MouShum
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-100",
              )}
            >
              <item.icon
                size={22}
                className={cn(
                  "min-w-[22px]",
                  isActive ? "" : "group-hover:scale-110 transition-transform",
                )}
              />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full" />
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-all group",
            pathname === "/admin/settings" && "bg-slate-800 text-white",
          )}
        >
          <Settings size={22} className="min-w-[22px]" />
          {!isCollapsed && (
            <span className="font-medium text-sm">Settings</span>
          )}
        </Link>

        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all mt-2 group"
        >
          <LogOut size={22} className="min-w-[22px]" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}
