import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import RoadmapList from "./RoadmapList";

export const revalidate = 0; // Avoid caching to keep roadmaps dynamic

export default async function RoadmapsPage() {
  const session = await auth();
  const userId = session?.user?.id || "";

  // Direct server-side PostgreSQL fetch using PrismaClient
  const roadmaps = await prisma.roadmap.findMany({
    where: { userId },
    include: {
      milestones: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Learning Roadmaps
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-light">
          Construct structured study tracks, organize step-by-step milestones, and track your overall completions.
        </p>
      </div>

      <RoadmapList initialRoadmaps={roadmaps as any} />
    </div>
  );
}
