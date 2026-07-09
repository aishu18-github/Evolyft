import { useTrackerStore } from "@/store/useTrackerStore";
import { useSettingsStore } from "@/store/useSettingsStore";

describe("Zustand Global State Stores", () => {
  
  describe("useTrackerStore (Study Timer & Session State)", () => {
    beforeEach(() => {
      // Ensure clean state before each test case
      useTrackerStore.getState().resetStore();
    });

    it("should initialize with correct default values", () => {
      const state = useTrackerStore.getState();
      expect(state.isRunning).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.subject).toBe("");
      expect(state.topic).toBe("");
      expect(state.duration).toBe(25);
      expect(state.secondsRemaining).toBe(25 * 60);
      expect(state.secondsElapsed).toBe(0);
      expect(state.timerType).toBe("pomodoro");
    });

    it("should start Pomodoro timer correctly with custom values", () => {
      const store = useTrackerStore.getState();
      store.startTimer("Computer Networks", "OSI Model", 45, "pomodoro");

      const state = useTrackerStore.getState();
      expect(state.isRunning).toBe(true);
      expect(state.isPaused).toBe(false);
      expect(state.subject).toBe("Computer Networks");
      expect(state.topic).toBe("OSI Model");
      expect(state.duration).toBe(45);
      expect(state.secondsRemaining).toBe(45 * 60);
      expect(state.timerType).toBe("pomodoro");
    });

    it("should start Stopwatch timer correctly", () => {
      const store = useTrackerStore.getState();
      store.startTimer("DSA", "Red Black Trees", 60, "stopwatch");

      const state = useTrackerStore.getState();
      expect(state.isRunning).toBe(true);
      expect(state.isPaused).toBe(false);
      expect(state.secondsRemaining).toBe(60 * 60);
      expect(state.secondsElapsed).toBe(0);
      expect(state.timerType).toBe("stopwatch");
    });

    it("should handle pause and resume actions", () => {
      const store = useTrackerStore.getState();
      store.startTimer("Math", "Calculus", 20, "pomodoro");
      
      store.pauseTimer();
      expect(useTrackerStore.getState().isPaused).toBe(true);

      store.resumeTimer();
      expect(useTrackerStore.getState().isPaused).toBe(false);
    });

    it("should tick seconds correctly for Pomodoro (count down)", () => {
      const store = useTrackerStore.getState();
      store.startTimer("Science", "Physics", 25, "pomodoro");

      store.tick();
      let state = useTrackerStore.getState();
      expect(state.secondsRemaining).toBe(25 * 60 - 1);
      expect(state.secondsElapsed).toBe(1);

      // Tick again
      store.tick();
      state = useTrackerStore.getState();
      expect(state.secondsRemaining).toBe(25 * 60 - 2);
      expect(state.secondsElapsed).toBe(2);
    });

    it("should tick seconds correctly for Stopwatch (count up)", () => {
      const store = useTrackerStore.getState();
      store.startTimer("Science", "Chemistry", 25, "stopwatch");

      store.tick();
      let state = useTrackerStore.getState();
      expect(state.secondsElapsed).toBe(1);

      store.tick();
      state = useTrackerStore.getState();
      expect(state.secondsElapsed).toBe(2);
    });

    it("should stop countdown and auto-pause when secondsRemaining is 0", () => {
      const store = useTrackerStore.getState();
      store.startTimer("NextJS", "Routing", 1, "pomodoro");
      // Manually set to 1 second left so next tick completes the timer
      useTrackerStore.setState({ secondsRemaining: 1 });
      // Tick 1s
      store.tick();
      
      const state = useTrackerStore.getState();
      expect(state.secondsRemaining).toBe(0);
      expect(state.secondsElapsed).toBe(1);
      expect(state.isPaused).toBe(true); // Should auto-pause on finish
    });

    it("should reset all states on resetStore", () => {
      const store = useTrackerStore.getState();
      store.startTimer("DBMS", "Indexing", 30, "stopwatch");
      store.tick();
      
      store.resetStore();
      const state = useTrackerStore.getState();
      expect(state.isRunning).toBe(false);
      expect(state.secondsElapsed).toBe(0);
      expect(state.subject).toBe("");
    });
  });

  describe("useSettingsStore (User Preferences & Themes)", () => {
    beforeEach(() => {
      useSettingsStore.getState().resetSettings();
    });

    it("should initialize with custom dark-first values", () => {
      const state = useSettingsStore.getState();
      expect(state.soundEnabled).toBe(true);
      expect(state.streakEmailReminders).toBe(true);
      expect(state.futuristicGlows).toBe(true);
      expect(state.weeklyReminders).toBe(false);
      expect(state.activeTheme).toBe("charcoal-violet");
    });

    it("should toggle preference flags on click", () => {
      const store = useSettingsStore.getState();
      
      store.toggleSound();
      expect(useSettingsStore.getState().soundEnabled).toBe(false);

      store.toggleGlows();
      expect(useSettingsStore.getState().futuristicGlows).toBe(false);

      store.toggleStreakEmails();
      expect(useSettingsStore.getState().streakEmailReminders).toBe(false);
    });

    it("should update active themes correctly", () => {
      const store = useSettingsStore.getState();
      
      store.setTheme("space-cyan");
      expect(useSettingsStore.getState().activeTheme).toBe("space-cyan");

      store.setTheme("abyss-pink");
      expect(useSettingsStore.getState().activeTheme).toBe("abyss-pink");
    });
  });
});
