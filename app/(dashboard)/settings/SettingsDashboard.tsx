"use client";

import React, { useState, useTransition } from "react";
import { useSettingsStore, EvolyftTheme } from "@/store/useSettingsStore";
import { updateUserProfile } from "@/actions/settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Settings,
  Bell,
  Volume2,
  Sparkles,
  Flame,
  Award,
  Calendar,
  Sliders,
  CheckCircle,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActive: string | Date | null;
  } | null;
}

interface SettingsDashboardProps {
  user: UserProfile;
}

export default function SettingsDashboard({ user }: SettingsDashboardProps) {
  const [isPending, startTransition] = useTransition();
  
  // Zustand client-side preference stores
  const prefs = useSettingsStore();

  const [name, setName] = useState(user.name);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("name", name);

    startTransition(async () => {
      const response = await updateUserProfile(null, formData);
      if (response?.error) {
        setError(response.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    });
  };

  const getThemeBadgeColor = (theme: EvolyftTheme) => {
    switch (theme) {
      case "charcoal-violet":
        return "bg-violet-600/10 border-violet-500/30 text-violet-400";
      case "space-cyan":
        return "bg-cyan-600/10 border-cyan-500/30 text-cyan-400";
      case "abyss-pink":
        return "bg-pink-600/10 border-pink-500/30 text-pink-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {error && (
        <div className="bg-red-950/30 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Profile display name updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Profile form card */}
          <Card className="border border-zinc-900 bg-zinc-950/45">
            <CardHeader className="border-b border-zinc-900 pb-4">
              <CardTitle className="text-xl font-bold flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-violet-400" />
                <span>Profile Credentials</span>
              </CardTitle>
              <CardDescription>
                Customize your display identity used across workspaces and timelines.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label htmlFor="profEmail">Email Address (Non-editable)</Label>
                  <Input
                    id="profEmail"
                    value={user.email}
                    disabled
                    className="bg-zinc-900/30 text-zinc-500 border-zinc-900/80 cursor-not-allowed select-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profName">Display Name</Label>
                  <Input
                    id="profName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Scholar Name"
                  />
                </div>

                <Button type="submit" isLoading={isPending} className="h-10 px-5 text-xs font-semibold">
                  Save Display Name
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preferences card */}
          <Card className="border border-zinc-900 bg-zinc-950/45">
            <CardHeader className="border-b border-zinc-900 pb-4">
              <CardTitle className="text-xl font-bold flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>Custom Preferences</span>
              </CardTitle>
              <CardDescription>
                Tweak futuristic visual themes and productivity alert states.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Theme selectors */}
              <div className="space-y-3.5">
                <Label>Active Color Accent Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  {(["charcoal-violet", "space-cyan", "abyss-pink"] as EvolyftTheme[]).map((theme) => {
                    const isSelected = prefs.activeTheme === theme;
                    const labels = {
                      "charcoal-violet": "Charcoal Violet",
                      "space-cyan": "Space Cyan",
                      "abyss-pink": "Abyss Pink",
                    };

                    return (
                      <button
                        key={theme}
                        onClick={() => prefs.setTheme(theme)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all select-none ${
                          isSelected
                            ? "bg-zinc-900/50 border-violet-500/30 shadow-md text-white font-bold"
                            : "bg-zinc-950/20 border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
                        }`}
                      >
                        <Badge className={`text-[9px] mb-2 uppercase ${getThemeBadgeColor(theme)}`}>
                          {theme.split("-")[1]}
                        </Badge>
                        <span className="text-xs">{labels[theme]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles list */}
              <div className="border-t border-zinc-900 pt-6 space-y-4">
                
                {/* Glow effects */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/20 border border-zinc-900">
                  <div className="space-y-1 pr-4">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      <span>Futuristic Ambient Glows</span>
                    </h4>
                    <p className="text-xs text-zinc-500 font-light leading-relaxed">
                      Enable glowing container shadows and overlay gradients for a sci-fi look.
                    </p>
                  </div>
                  <button
                    onClick={() => prefs.toggleGlows()}
                    className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center p-0.5 ${
                      prefs.futuristicGlows ? "bg-violet-600" : "bg-zinc-800"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        prefs.futuristicGlows ? "transform translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Sound */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/20 border border-zinc-900">
                  <div className="space-y-1 pr-4">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      <span>Pomodoro Timer Sounds</span>
                    </h4>
                    <p className="text-xs text-zinc-500 font-light leading-relaxed">
                      Play acoustic notifications upon completing study countdown targets.
                    </p>
                  </div>
                  <button
                    onClick={() => prefs.toggleSound()}
                    className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center p-0.5 ${
                      prefs.soundEnabled ? "bg-violet-600" : "bg-zinc-800"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        prefs.soundEnabled ? "transform translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Email Streaks */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/20 border border-zinc-900">
                  <div className="space-y-1 pr-4">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <Bell className="w-4 h-4 text-pink-400" />
                      <span>Streak Email Reminders</span>
                    </h4>
                    <p className="text-xs text-zinc-500 font-light leading-relaxed">
                      Get alert warnings when your daily active study session streak is close to breaking.
                    </p>
                  </div>
                  <button
                    onClick={() => prefs.toggleStreakEmails()}
                    className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center p-0.5 ${
                      prefs.streakEmailReminders ? "bg-violet-600" : "bg-zinc-800"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        prefs.streakEmailReminders ? "transform translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

              </div>

            </CardContent>
          </Card>

        </div>

        {/* Sidebar credentials / streak metrics */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-zinc-900 bg-zinc-950/45 p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-violet-600/5 blur-xl -z-10" />
            
            <div className="flex flex-col space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5 pb-3 border-b border-zinc-900/60">
                <Award className="w-4 h-4 text-violet-400" />
                <span>Streak Standing</span>
              </h3>

              {/* Day streak display */}
              <div className="flex items-center justify-between bg-zinc-900/30 p-4 rounded-2xl border border-zinc-900/80">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Current Streak</span>
                  <p className="text-3xl font-extrabold text-white">
                    {user.streak?.currentStreak || 0} <span className="text-xs text-zinc-500 font-semibold font-sans">DAYS</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                  <Flame className="w-5.5 h-5.5 text-violet-400" />
                </div>
              </div>

              {/* Records */}
              <div className="space-y-3.5 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-medium">Longest Streak Reached</span>
                  <span className="text-white font-mono font-bold">{user.streak?.longestStreak || 0} days</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-medium">Last Active Timestamp</span>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    {user.streak?.lastActive
                      ? new Date(user.streak.lastActive).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Never active"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-900 mt-6 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                Standing Updated
              </span>
              <span>Online</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
