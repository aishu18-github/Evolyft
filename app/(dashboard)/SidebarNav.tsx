"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Compass,
  Clock,
  Bookmark,
  TrendingUp,
  LogOut,
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  Settings,
} from "lucide-react";
import { logoutUser } from "@/actions/auth";

interface SidebarNavProps {
  user: {
    name: string;
    email: string;
  };
}

export default function SidebarNav({ user }: SidebarNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Learning Roadmaps", href: "/roadmaps", icon: Compass },
    { name: "Study Tracker", href: "/tracker", icon: Clock },
    { name: "Resource Vault", href: "/resources", icon: Bookmark },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logoutUser();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-6">
      {/* Brand logo */}
      <div>
        <div className="flex items-center space-x-2.5 mb-10 select-none">
          <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-sans">
            Evolyft
          </span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="relative block"
              >
                <div
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "text-white font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {/* Active background glow transition */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-violet-600/10 border border-violet-500/20 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile & Logout section */}
      <div className="space-y-4 pt-6 border-t border-zinc-900/60">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
            <UserIcon className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{user.name}</h4>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-500/10 transition-all group"
        >
          <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-400 transition-colors" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden md:block w-64 glass-card border-y-0 border-l-0 border-r border-zinc-900/50">
        {sidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between md:hidden bg-zinc-950/80 border-b border-zinc-900/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-2.5 select-none">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-md font-bold tracking-tight text-white">Evolyft</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar (Slide Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm"
            />
            {/* Sidebar menu drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden w-72 bg-zinc-950 border-r border-zinc-900"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Spacing for mobile headers */}
      <div className="h-16 md:hidden w-full" />
    </>
  );
}
