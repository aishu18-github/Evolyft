import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ResourceCatalog from "./ResourceCatalog";

export const revalidate = 0; // Dynamic component

export default async function ResourcesPage() {
  const session = await auth();
  const userId = session?.user?.id || "";

  // Direct server query to database
  const resources = await prisma.resource.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Resource Library
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-light">
          Manage articles, documentation, notes, and videos. Quick-search bookmarks with customized tag systems.
        </p>
      </div>

      <ResourceCatalog initialResources={resources as any} />
    </div>
  );
}
