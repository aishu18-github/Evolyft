"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Cell,
  Pie,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Clock, Award, Star, BarChart3, TrendingUp, Sparkles } from "lucide-react";

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  notes: string | null;
  productivityRating: number;
  difficultyLevel: string;
  studyDate: Date | string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActive: Date | string | null;
}

interface Roadmap {
  id: string;
  title: string;
  status: string;
  milestones: { id: string; isCompleted: boolean }[];
}

interface AnalyticsDashboardProps {
  sessions: StudySession[];
  streak: StreakData | null;
  roadmaps: Roadmap[];
}

export default function AnalyticsDashboard({ sessions, streak, roadmaps }: AnalyticsDashboardProps) {
  
  // 1. Metric calculations
  const totalDuration = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = (totalDuration / 60).toFixed(1);
  const avgProductivity =
    sessions.length > 0
      ? (sessions.reduce((acc, s) => acc + s.productivityRating, 0) / sessions.length).toFixed(1)
      : "0";

  const totalMilestones = roadmaps.reduce((acc, r) => acc + r.milestones.length, 0);
  const completedMilestones = roadmaps.reduce(
    (acc, r) => acc + r.milestones.filter((m) => m.isCompleted).length,
    0
  );
  const milestonesPercent =
    totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // 2. Focused Hours Trend Chart Data (Last 7 Sessions or daily aggregates)
  // Let's aggregate by date for a cleaner trend
  const dailyHoursMap: { [key: string]: number } = {};
  sessions.forEach((s) => {
    const dateStr = new Date(s.studyDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    dailyHoursMap[dateStr] = (dailyHoursMap[dateStr] || 0) + s.duration / 60;
  });

  const trendData = Object.keys(dailyHoursMap)
    .map((date) => ({
      date,
      hours: parseFloat(dailyHoursMap[date].toFixed(2)),
    }))
    .slice(-7); // Keep last 7 active study days

  // Fallback if empty
  const trendChartData =
    trendData.length > 0
      ? trendData
      : [
          { date: "Day 1", hours: 0 },
          { date: "Day 2", hours: 0 },
          { date: "Day 3", hours: 0 },
        ];

  // 3. Skill/Subject Distribution Pie Chart Data
  const subjectMap: { [key: string]: number } = {};
  sessions.forEach((s) => {
    subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.duration;
  });

  const pieColors = ["#8b5cf6", "#06b6d4", "#6366f1", "#ec4899", "#10b981", "#f59e0b"];
  const subjectData = Object.keys(subjectMap).map((subject, idx) => ({
    name: subject,
    value: subjectMap[subject],
    color: pieColors[idx % pieColors.length],
  }));

  const subjectChartData =
    subjectData.length > 0 ? subjectData : [{ name: "No data", value: 1, color: "#27272a" }];

  // 4. Productivity by Difficulty Bar Chart
  const diffProductivity: { [key: string]: { sum: number; count: number } } = {
    EASY: { sum: 0, count: 0 },
    MEDIUM: { sum: 0, count: 0 },
    HARD: { sum: 0, count: 0 },
  };

  sessions.forEach((s) => {
    if (diffProductivity[s.difficultyLevel]) {
      diffProductivity[s.difficultyLevel].sum += s.productivityRating;
      diffProductivity[s.difficultyLevel].count += 1;
    }
  });

  const barChartData = ["EASY", "MEDIUM", "HARD"].map((level) => {
    const data = diffProductivity[level];
    return {
      level,
      rating: data.count > 0 ? parseFloat((data.sum / data.count).toFixed(2)) : 0,
    };
  });

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak card */}
        <Card className="border border-zinc-900 bg-zinc-950/45 p-6 hover:border-zinc-800/80 transition-all">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Consistency Streak</span>
              <p className="text-3xl font-extrabold text-white">
                {streak?.currentStreak || 0} <span className="text-sm font-semibold text-zinc-500">days</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-violet-400 animate-pulse" />
            </div>
          </div>
          <div className="pt-4 border-t border-zinc-900 mt-4 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>Longest Streak: {streak?.longestStreak || 0}d</span>
            <span>Active first</span>
          </div>
        </Card>

        {/* Study Hours Card */}
        <Card className="border border-zinc-900 bg-zinc-950/45 p-6 hover:border-zinc-800/80 transition-all">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Study Duration</span>
              <p className="text-3xl font-extrabold text-white">
                {totalHours} <span className="text-sm font-semibold text-zinc-500">hours</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="pt-4 border-t border-zinc-900 mt-4 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>Sessions Logged: {sessions.length}</span>
            <span>Total minutes: {totalDuration}m</span>
          </div>
        </Card>

        {/* Productivity score card */}
        <Card className="border border-zinc-900 bg-zinc-950/45 p-6 hover:border-zinc-800/80 transition-all">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Avg Productivity</span>
              <p className="text-3xl font-extrabold text-white">
                {avgProductivity} <span className="text-sm font-semibold text-zinc-500">/ 5</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
          <div className="pt-4 border-t border-zinc-900 mt-4 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>Rating scale: Stars</span>
            <span>High performance</span>
          </div>
        </Card>

        {/* Milestone Card */}
        <Card className="border border-zinc-900 bg-zinc-950/45 p-6 hover:border-zinc-800/80 transition-all">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Milestones Met</span>
              <p className="text-3xl font-extrabold text-white">
                {milestonesPercent}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div className="pt-4 border-t border-zinc-900 mt-4 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>Completed: {completedMilestones}/{totalMilestones}</span>
            <span>Tracks active: {roadmaps.length}</span>
          </div>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-8">
          <Card className="border border-zinc-900 bg-zinc-950/45 p-6">
            <CardHeader className="p-0 pb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                  <span>Focused Hours Trend</span>
                </CardTitle>
                <CardDescription>Visual tracker mapping hours studied over your last 7 learning sessions.</CardDescription>
              </div>
              <Badge variant="outline">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                Active Days
              </Badge>
            </CardHeader>
            <CardContent className="p-0 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(9, 9, 11, 0.9)",
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
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#hoursGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Subject Pie Chart */}
        <div className="lg:col-span-4">
          <Card className="border border-zinc-900 bg-zinc-950/45 p-6 h-full flex flex-col justify-between">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-bold flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Subject Distribution</span>
              </CardTitle>
              <CardDescription>Breakdown of focus time across subjects.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex flex-col items-center justify-center flex-1">
              <div className="w-full h-[180px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {subjectChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center visual label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
                  <span className="text-2xl font-extrabold text-white">{sessions.length}</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Logs</span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full grid grid-cols-2 gap-2 mt-4 max-h-[85px] overflow-y-auto pr-1">
                {subjectData.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-[10px]">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-400 font-medium truncate max-w-[80px]" title={item.name}>
                      {item.name}
                    </span>
                    <span className="text-zinc-600 font-mono">
                      ({Math.round((item.value / totalDuration) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Productivity by Difficulty Analysis (Bar Chart) */}
      <Card className="border border-zinc-900 bg-zinc-950/45 p-6 max-w-2xl">
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-lg font-bold flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>Productivity vs Difficulty</span>
          </CardTitle>
          <CardDescription>Average productivity ratings (1 to 5) compared against difficulty ratings.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="level" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={11} domain={[0, 5]} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(9, 9, 11, 0.9)",
                  borderColor: "rgba(63, 63, 70, 0.4)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="rating" fill="#6366f1" radius={[8, 8, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.level === "EASY" ? "#10b981" : entry.level === "MEDIUM" ? "#06b6d4" : "#ec4899"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
