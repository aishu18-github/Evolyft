"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Updates the user's profile information (e.g. display name) in PostgreSQL
 */
export async function updateUserProfile(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be authenticated." };
    }

    const name = formData.get("name") as string | null;

    if (!name || name.trim() === "") {
      return { error: "Display name cannot be empty." };
    }

    const userId = session.user.id;

    // Update standard user credentials
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    // Create activity logs
    await prisma.activityLog.create({
      data: {
        userId,
        action: "PROFILE_UPDATED",
        details: `Updated name to "${name}"`,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return { error: error.message || "Failed to update profile." };
  }
}
