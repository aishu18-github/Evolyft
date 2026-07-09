import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SidebarNav from "./SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name || "Scholar",
    email: session.user.email || "",
  };

  return (
    <div className="flex min-h-screen text-white bg-zinc-950/20">
      {/* Sidebar navigation */}
      <SidebarNav user={user} />

      {/* Main workspace container */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <main className="flex-1 p-6 md:p-10 relative z-10 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
