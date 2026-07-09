"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Creates a new learning roadmap with milestones in PostgreSQL
 */
export async function createRoadmap(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be authenticated." };
    }

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;
    const milestoneStrings = formData.getAll("milestones[]") as string[];

    if (!title || !category) {
      return { error: "Title and Category are required." };
    }

    const userId = session.user.id;

    // Build milestones array with proper ordering
    const milestonesData = milestoneStrings
      .filter((milestone) => milestone.trim() !== "")
      .map((milestone, index) => ({
        title: milestone,
        order: index + 1,
        isCompleted: false,
      }));

    // Create the roadmap in the database
    await prisma.roadmap.create({
      data: {
        userId,
        title,
        description,
        category,
        status: "IN_PROGRESS",
        milestones: {
          create: milestonesData,
        },
      },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: "ROADMAP_CREATED",
        details: `Created roadmap: "${title}" in "${category}"`,
      },
    });

    revalidatePath("/roadmaps");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Roadmap creation error:", error);
    return { error: error.message || "Something went wrong." };
  }
}

/**
 * Toggles a milestone state and updates the parent roadmap's overall progress status
 */
export async function toggleMilestone(milestoneId: string, isCompleted: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthenticated.");
    }

    // Update milestone
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      include: {
        roadmap: {
          include: {
            milestones: true,
          },
        },
      },
    });

    const roadmap = updatedMilestone.roadmap;
    const allMilestones = roadmap.milestones;
    const completedCount = allMilestones.filter((m) => m.isCompleted).length;

    let newStatus = "IN_PROGRESS";
    if (completedCount === allMilestones.length && allMilestones.length > 0) {
      newStatus = "COMPLETED";
    } else if (completedCount === 0) {
      newStatus = "NOT_STARTED";
    }

    // Update roadmap status
    await prisma.roadmap.update({
      where: { id: roadmap.id },
      data: { status: newStatus },
    });

    // Log activity if milestone is newly completed
    if (isCompleted) {
      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: "MILESTONE_COMPLETED",
          details: `Completed: "${updatedMilestone.title}" in roadmap "${roadmap.title}"`,
        },
      });
    }

    revalidatePath("/roadmaps");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Milestone toggle error:", error);
    return { error: "Failed to update milestone." };
  }
}

/**
 * Deletes a roadmap from the database
 */
export async function deleteRoadmap(roadmapId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthenticated.");
    }

    const roadmap = await prisma.roadmap.delete({
      where: { id: roadmapId },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "ROADMAP_DELETED",
        details: `Deleted roadmap: "${roadmap.title}"`,
      },
    });

    revalidatePath("/roadmaps");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Roadmap delete error:", error);
    return { error: "Failed to delete roadmap." };
  }
}
