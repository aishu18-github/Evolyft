"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const password = formData.get("password") as string | null;
    const confirmPassword = formData.get("confirmPassword") as string | null;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const response = await registerUser(null, formData);
      if (response?.error) {
        setError(response.error);
      } else {
        // Success: redirect to login
        router.push("/login?registered=true");
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6 inline-flex items-center text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-950/60 px-3 py-1.5 rounded-full border border-zinc-900">
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
        Back Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        <Card className="border border-zinc-900 bg-zinc-950/65 shadow-2xl backdrop-blur-md">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">Create an account</CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Start structuring your milestones and tracking study consistency.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error ? (
                <div className="bg-red-950/30 text-red-400 border border-red-500/20 px-3.5 py-2.5 rounded-xl text-xs font-medium text-center">
                  {error}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="bg-zinc-950/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="bg-zinc-950/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="bg-zinc-950/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="bg-zinc-950/40"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-4">
              <Button type="submit" isLoading={isPending} className="w-full">
                Register
              </Button>
              <div className="text-xs text-zinc-500 text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
