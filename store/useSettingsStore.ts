import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EvolyftTheme = "charcoal-violet" | "space-cyan" | "abyss-pink";

interface SettingsState {
  soundEnabled: boolean;
  streakEmailReminders: boolean;
  futuristicGlows: boolean;
  weeklyReminders: boolean;
  activeTheme: EvolyftTheme;

  toggleSound: () => void;
  toggleStreakEmails: () => void;
  toggleGlows: () => void;
  toggleWeeklyReminders: () => void;
  setTheme: (theme: EvolyftTheme) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      streakEmailReminders: true,
      futuristicGlows: true,
      weeklyReminders: false,
      activeTheme: "charcoal-violet",

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleStreakEmails: () => set((state) => ({ streakEmailReminders: !state.streakEmailReminders })),
      toggleGlows: () => set((state) => ({ futuristicGlows: !state.futuristicGlows })),
      toggleWeeklyReminders: () => set((state) => ({ weeklyReminders: !state.weeklyReminders })),
      setTheme: (theme) => set({ activeTheme: theme }),
      
      resetSettings: () =>
        set({
          soundEnabled: true,
          streakEmailReminders: true,
          futuristicGlows: true,
          weeklyReminders: false,
          activeTheme: "charcoal-violet",
        }),
    }),
    {
      name: "evolyft-user-preferences",
    }
  )
);
