import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import DashboardHub from "./DashboardHub";

export const revalidate = 0; // Keep dynamic

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id || "";
  const userName = session?.user?.name || "Scholar";

  // 1. Fetch Streak Data
  const streak = await prisma.streakData.findUnique({
    where: { userId },
  });

  // 2. Fetch counts
  const sessionsCount = await prisma.studySession.count({
    where: { userId },
  });

  const roadmapsCount = await prisma.roadmap.count({
    where: { userId },
  });

  // 3. Fetch recent activities
  const activityLogs = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // 4. Calculate weekly hours studied (sliding 7-day window)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentSessions = await prisma.studySession.findMany({
    where: {
      userId,
      studyDate: {
        gte: sevenDaysAgo,
      },
    },
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartDataMap: { [key: string]: number } = {};

  // Initialize sliding window with zero hours
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dayName = `${days[d.getDay()]} ${d.getDate()}`;
    chartDataMap[dayName] = 0;
  }

  // Aggregate logged minutes into hours
  recentSessions.forEach((s) => {
    const d = new Date(s.studyDate);
    const dayName = `${days[d.getDay()]} ${d.getDate()}`;
    if (chartDataMap[dayName] !== undefined) {
      chartDataMap[dayName] += s.duration / 60;
    }
  });

  const weeklyHoursData = Object.keys(chartDataMap).map((day) => ({
    day,
    hours: parseFloat(chartDataMap[day].toFixed(2)),
  }));

  const user = { name: userName };

  return (
    <DashboardHub
      user={user}
      streak={streak as any}
      sessionsCount={sessionsCount}
      roadmapsCount={roadmapsCount}
      activityLogs={activityLogs as any}
      weeklyHoursData={weeklyHoursData}
    />
  );
}
