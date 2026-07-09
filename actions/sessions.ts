"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Logs a completed study session in the database and updates user streaks
 */
export async function logStudySession(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be authenticated." };
    }

    const subject = formData.get("subject") as string | null;
    const topic = formData.get("topic") as string | null;
    const durationStr = formData.get("duration") as string | null; // in minutes
    const notes = formData.get("notes") as string | null;
    const ratingStr = formData.get("productivityRating") as string | null;
    const difficultyLevel = formData.get("difficultyLevel") as string | null;

    if (!subject || !topic || !durationStr || !ratingStr || !difficultyLevel) {
      return { error: "All required fields must be filled." };
    }

    const duration = parseInt(durationStr, 10);
    const productivityRating = parseInt(ratingStr, 10);

    if (isNaN(duration) || duration <= 0) {
      return { error: "Duration must be a positive number." };
    }

    const userId = session.user.id;

    // Save study session
    const studySession = await prisma.studySession.create({
      data: {
        userId,
        subject,
        topic,
        duration,
        notes,
        productivityRating,
        difficultyLevel,
        studyDate: new Date(),
      },
    });

    // Update Streak system
    const streak = await prisma.streakData.findUnique({
      where: { userId },
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let currentStreak = 1;
    let longestStreak = 1;

    if (!streak) {
      // First time streak initialization
      await prisma.streakData.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActive: now,
        },
      });
    } else {
      const lastActive = streak.lastActive;
      if (!lastActive) {
        currentStreak = 1;
        longestStreak = Math.max(1, streak.longestStreak);
      } else {
        const lastActiveDate = new Date(
          lastActive.getFullYear(),
          lastActive.getMonth(),
          lastActive.getDate()
        );
        const differenceInMs = today.getTime() - lastActiveDate.getTime();
        const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

        if (differenceInDays === 1) {
          // Increment streak
          currentStreak = streak.currentStreak + 1;
          longestStreak = Math.max(currentStreak, streak.longestStreak);
        } else if (differenceInDays > 1) {
          // Broken streak, reset
          currentStreak = 1;
          longestStreak = streak.longestStreak;
        } else {
          // Already logged a session today (differenceInDays === 0)
          currentStreak = streak.currentStreak;
          longestStreak = streak.longestStreak;
        }
      }

      await prisma.streakData.update({
        where: { userId },
        data: {
          currentStreak,
          longestStreak,
          lastActive: now,
        },
      });
    }

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: "SESSION_LOGGED",
        details: `Studied "${topic}" in "${subject}" for ${duration}m (${productivityRating}/5 productivity)`,
      },
    });

    revalidatePath("/tracker");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return { success: true };
  } catch (error: any) {
    console.error("Log study session error:", error);
    return { error: error.message || "Something went wrong." };
  }
}

/**
 * Fetches recent study sessions for the active user
 */
export async function getRecentSessions(limit = 10) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    return await prisma.studySession.findMany({
      where: { userId: session.user.id },
      orderBy: { studyDate: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error("Fetch sessions error:", error);
    return [];
  }
}
