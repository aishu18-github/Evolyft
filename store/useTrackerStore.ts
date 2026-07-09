import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TrackerState {
  isRunning: boolean;
  isPaused: boolean;
  subject: string;
  topic: string;
  duration: number; // in minutes
  secondsRemaining: number;
  secondsElapsed: number;
  timerType: "pomodoro" | "stopwatch";
  
  startTimer: (subject: string, topic: string, duration: number, type: "pomodoro" | "stopwatch") => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
  resetStore: () => void;
}

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      isPaused: false,
      subject: "",
      topic: "",
      duration: 25,
      secondsRemaining: 25 * 60,
      secondsElapsed: 0,
      timerType: "pomodoro",

      startTimer: (subject, topic, duration, timerType) => {
        set({
          isRunning: true,
          isPaused: false,
          subject,
          topic,
          duration,
          timerType,
          secondsRemaining: duration * 60,
          secondsElapsed: 0,
        });
      },

      pauseTimer: () => {
        set({ isPaused: true });
      },

      resumeTimer: () => {
        set({ isPaused: false });
      },

      stopTimer: () => {
        set({
          isRunning: false,
          isPaused: false,
        });
      },

      tick: () => {
        const { isRunning, isPaused, timerType, secondsRemaining, secondsElapsed } = get();
        if (!isRunning || isPaused) return;

        if (timerType === "pomodoro") {
          if (secondsRemaining <= 1) {
            // Timer completed
            set({
              secondsRemaining: 0,
              secondsElapsed: secondsElapsed + 1,
              isPaused: true, // Auto pause at completion
            });
          } else {
            set({
              secondsRemaining: secondsRemaining - 1,
              secondsElapsed: secondsElapsed + 1,
            });
          }
        } else {
          // Stopwatch counts up
          set({
            secondsElapsed: secondsElapsed + 1,
          });
        }
      },

      resetStore: () => {
        set({
          isRunning: false,
          isPaused: false,
          subject: "",
          topic: "",
          duration: 25,
          secondsRemaining: 25 * 60,
          secondsElapsed: 0,
          timerType: "pomodoro",
        });
      },
    }),
    {
      name: "evolyft-study-tracker",
    }
  )
);
