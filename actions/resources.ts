"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Saves a new study link bookmark in the PostgreSQL resource library
 */
export async function saveResource(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be authenticated." };
    }

    const title = formData.get("title") as string | null;
    const url = formData.get("url") as string | null;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;
    const tagsString = formData.get("tags") as string | null;

    if (!title || !url || !category) {
      return { error: "Title, URL, and Category are required." };
    }

    const userId = session.user.id;

    // Parse comma-separated tags into a clean array
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];

    await prisma.resource.create({
      data: {
        userId,
        title,
        url,
        description,
        category,
        tags,
        isFavorite: false,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: "RESOURCE_ADDED",
        details: `Added bookmark: "${title}" in "${category}"`,
      },
    });

    revalidatePath("/resources");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Resource creation error:", error);
    return { error: error.message || "Something went wrong." };
  }
}

/**
 * Toggles the favorite status of a resource
 */
export async function toggleFavoriteResource(resourceId: string, isFavorite: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthenticated.");
    }

    const updated = await prisma.resource.update({
      where: { id: resourceId },
      data: { isFavorite },
    });

    if (isFavorite) {
      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: "RESOURCE_FAVORITED",
          details: `Favorited bookmark: "${updated.title}"`,
        },
      });
    }

    revalidatePath("/resources");
    return { success: true };
  } catch (error) {
    console.error("Favorite toggle error:", error);
    return { error: "Failed to toggle favorite." };
  }
}

/**
 * Deletes a resource from the library
 */
export async function deleteResource(resourceId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthenticated.");
    }

    const deleted = await prisma.resource.delete({
      where: { id: resourceId },
    });

    revalidatePath("/resources");
    return { success: true };
  } catch (error) {
    console.error("Resource delete error:", error);
    return { error: "Failed to delete resource." };
  }
}
