import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import SettingsDashboard from "./SettingsDashboard";

export const revalidate = 0; // Dynamic component

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id || "";

  // Direct server query to fetch profile name, email, and streak metrics
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      streak: {
        select: {
          currentStreak: true,
          longestStreak: true,
          lastActive: true,
        },
      },
    },
  });

  const profileData = {
    name: user?.name || "Scholar",
    email: user?.email || "",
    streak: user?.streak
      ? {
          currentStreak: user.streak.currentStreak,
          longestStreak: user.streak.longestStreak,
          lastActive: user.streak.lastActive,
        }
      : null,
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Preferences & Settings
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-light">
          Manage your account profile details, streak standing, sound levels, and neon glowing accent themes.
        </p>
      </div>

      <SettingsDashboard user={profileData} />
    </div>
  );
}
