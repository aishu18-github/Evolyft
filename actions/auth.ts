"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

/**
 * Creates a new user in the PostgreSQL database and logs them in
 */
export async function registerUser(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and initialize their StreakData
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        streak: {
          create: {
            currentStreak: 0,
            longestStreak: 0,
          },
        },
        activities: {
          create: {
            action: "USER_REGISTERED",
            details: `Created account for ${email}`,
          },
        },
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { error: error.message || "An unexpected error occurred during registration." };
  }
}

/**
 * Logs in a user using credentials via Auth.js (NextAuth v5)
 */
export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong during sign-in." };
      }
    }
    // Re-throw if it's a redirect error (which next-auth uses internally)
    if ((error as any).message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "An unexpected error occurred." };
  }
}

/**
 * Logs out the current active user
 */
export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}
