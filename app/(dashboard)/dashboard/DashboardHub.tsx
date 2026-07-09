"use client";

import React from "react";
import Link from "next/link";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Calendar,
  CheckCircle,
} from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  details: string | null;
  createdAt: Date | string;
}

interface DashboardHubProps {
  user: { name: string };
  streak: { currentStreak: number; longestStreak: number } | null;
  sessionsCount: number;
  roadmapsCount: number;
  activityLogs: ActivityLog[];
  weeklyHoursData: { day: string; hours: number }[];
}

export default function DashboardHub({
  user,
  streak,
  sessionsCount,
  roadmapsCount,
  activityLogs,
  weeklyHoursData,
}: DashboardHubProps) {
  
  const getActionStyles = (action: string) => {
    switch (action) {
      case "USER_REGISTERED":
        return "bg-violet-950/40 text-violet-300 border-violet-500/20";
      case "ROADMAP_CREATED":
        return "bg-cyan-950/40 text-cyan-300 border-cyan-500/20";
      case "MILESTONE_COMPLETED":
        return "bg-emerald-950/40 text-emerald-300 border-emerald-500/20";
      case "SESSION_LOGGED":
        return "bg-amber-950/40 text-amber-300 border-amber-500/20";
      case "RESOURCE_ADDED":
        return "bg-pink-950/40 text-pink-300 border-pink-500/20";
      default:
        return "bg-zinc-900 text-zinc-300 border-zinc-800";
    }
  };

  const getActionLabel = (action: string) => {
    return action.replace("_", " ");
  };

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/30 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 to-cyan-500/5 blur-xl -z-10" />
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-sans flex items-center space-x-2">
            <span>Welcome back, {user.name}</span>
            <Sparkles className="w-5.5 h-5.5 text-violet-400 animate-pulse" />
          </h2>
          <p className="text-zinc-400 text-sm md:text-base font-light max-w-xl">
            Elevate the way you learn today. You have {roadmapsCount} active roadmaps in progress and have logged {sessionsCount} focused study sessions.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <Link href="/tracker">
            <Button className="h-10.5 text-xs font-semibold px-4">
              Start Study Timer
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics widgets row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Weekly hours mini Recharts */}
        <div className="lg:col-span-8">
          <Card className="border border-zinc-900 bg-zinc-950/45 p-6 h-full flex flex-col justify-between">
            <CardHeader className="p-0 pb-6 flex items-center justify-between flex-row">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  <span>Weekly Study Habit</span>
                </CardTitle>
                <CardDescription>Aggregate of hours studied over the past 7 calendar days.</CardDescription>
              </div>
              <Badge variant="primary" className="text-[10px] tracking-widest font-mono">
                LIVE
              </Badge>
            </CardHeader>

            <CardContent className="p-0 h-[190px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyHoursData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(9, 9, 11, 0.95)",
                      borderColor: "rgba(63, 63, 70, 0.4)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#weeklyGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Stats card and shortcuts */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Active streak */}
          <Card className="border border-zinc-900 bg-zinc-950/45 p-6 flex flex-col justify-between flex-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-violet-600/5 blur-xl -z-10" />
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Current Streak</span>
                <p className="text-4xl font-extrabold text-white flex items-baseline">
                  {streak?.currentStreak || 0}
                  <span className="text-xs text-zinc-500 font-bold ml-1.5 uppercase font-sans">Days</span>
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-violet-400 animate-pulse" />
              </div>
            </div>

            <div className="pt-5 border-t border-zinc-900 mt-5 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
              <span>Longest streak: {streak?.longestStreak || 0}d</span>
              <Link href="/tracker" className="text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center">
                Boost Streak
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </Card>

          {/* Quick shortcuts */}
          <Card className="border border-zinc-900 bg-zinc-950/45 p-6 flex flex-col justify-between flex-1">
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Quick Shortcuts</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/roadmaps">
                  <div className="p-3 rounded-xl bg-zinc-900/35 border border-zinc-900 hover:border-zinc-800/80 hover:bg-zinc-900/60 transition-all text-center flex flex-col items-center justify-center space-y-1 cursor-pointer">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-bold text-zinc-300">Milestones</span>
                  </div>
                </Link>
                <Link href="/resources">
                  <div className="p-3 rounded-xl bg-zinc-900/35 border border-zinc-900 hover:border-zinc-800/80 hover:bg-zinc-900/60 transition-all text-center flex flex-col items-center justify-center space-y-1 cursor-pointer">
                    <BookOpen className="w-4 h-4 text-pink-400" />
                    <span className="text-[10px] font-bold text-zinc-300">Bookmarks</span>
                  </div>
                </Link>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Activity Logs feed */}
      <Card className="border border-zinc-900 bg-zinc-950/45 p-6">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg font-bold flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Learning Timeline</span>
          </CardTitle>
          <CardDescription>Your recent interactive accomplishments on Evolyft.</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="space-y-4">
            {activityLogs.length === 0 ? (
              <div className="text-center py-8 text-zinc-600 text-xs font-light">
                No activity logs found. Start completing roadmaps or logs and populate your timeline!
              </div>
            ) : (
              activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-zinc-900/20 border border-zinc-900 rounded-xl gap-3 transition-all hover:bg-zinc-900/40 hover:border-zinc-800/50"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="flex-shrink-0">
                      <Badge className={`uppercase text-[9px] font-bold ${getActionStyles(log.action)}`}>
                        {getActionLabel(log.action)}
                      </Badge>
                    </div>
                    <span className="text-xs text-zinc-300 leading-tight truncate max-w-sm sm:max-w-md font-light" title={log.details || ""}>
                      {log.details}
                    </span>
                  </div>

                  <span className="text-[10px] text-zinc-500 font-mono self-end sm:self-auto flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-zinc-650" />
                    {new Date(log.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
