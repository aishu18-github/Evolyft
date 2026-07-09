import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import AnalyticsDashboard from "./AnalyticsDashboard";

export const revalidate = 0; // Keep dynamic

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session?.user?.id || "";

  // 1. Fetch study sessions sorted chronologically for trend charting
  const sessions = await prisma.studySession.findMany({
    where: { userId },
    orderBy: {
      studyDate: "asc",
    },
  });

  // 2. Fetch active user streak metrics
  const streak = await prisma.streakData.findUnique({
    where: { userId },
  });

  // 3. Fetch roadmaps along with milestones counts for completion stats
  const roadmaps = await prisma.roadmap.findMany({
    where: { userId },
    include: {
      milestones: {
        select: {
          id: true,
          isCompleted: true,
        },
      },
    },
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Habits & Analytics
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-light">
          Monitor your consistency streaks, review topic distributions, and assess study productivity metrics.
        </p>
      </div>

      <AnalyticsDashboard
        sessions={sessions as any}
        streak={streak as any}
        roadmaps={roadmaps as any}
      />
    </div>
  );
}
