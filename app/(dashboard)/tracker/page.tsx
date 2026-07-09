"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useTrackerStore } from "@/store/useTrackerStore";
import { logStudySession, getRecentSessions } from "@/actions/sessions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, RotateCcw, Clock, Calendar, Star, Flame, Trophy } from "lucide-react";

export default function StudyTrackerPage() {
  const tracker = useTrackerStore();
  const [isPending, startTransition] = useTransition();
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Manual session logging form state
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [rating, setRating] = useState(4);
  const [notes, setNotes] = useState("");

  // Setup interval for timer tick
  useEffect(() => {
    let intervalId: any;
    if (tracker.isRunning && !tracker.isPaused) {
      intervalId = setInterval(() => {
        tracker.tick();
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [tracker.isRunning, tracker.isPaused]);

  // Load recent sessions
  const loadRecentSessions = async () => {
    const data = await getRecentSessions(6);
    setRecentSessions(data);
  };

  useEffect(() => {
    loadRecentSessions();
  }, []);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle active session logging
  const handleLogActiveSession = async () => {
    setError(null);
    setSuccess(false);

    // Calculate completed minutes (at least 1 minute or duration elapsed)
    const minutes = Math.max(1, Math.round(tracker.secondsElapsed / 60));

    const formData = new FormData();
    formData.append("subject", tracker.subject);
    formData.append("topic", tracker.topic);
    formData.append("duration", minutes.toString());
    formData.append("productivityRating", rating.toString());
    formData.append("difficultyLevel", difficulty);
    formData.append("notes", `Session tracked via live timer. ${notes}`);

    startTransition(async () => {
      const response = await logStudySession(null, formData);
      if (response?.error) {
        setError(response.error);
      } else {
        setSuccess(true);
        tracker.resetStore();
        setNotes("");
        loadRecentSessions();
        setTimeout(() => setSuccess(false), 5000);
      }
    });
  };

  // Handle manual session logging
  const handleLogManualSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("topic", topic);
    formData.append("duration", duration);
    formData.append("productivityRating", rating.toString());
    formData.append("difficultyLevel", difficulty);
    formData.append("notes", notes);

    startTransition(async () => {
      const response = await logStudySession(null, formData);
      if (response?.error) {
        setError(response.error);
      } else {
        setSuccess(true);
        setSubject("");
        setTopic("");
        setDuration("");
        setNotes("");
        setRating(4);
        setDifficulty("MEDIUM");
        loadRecentSessions();
        setTimeout(() => setSuccess(false), 5000);
      }
    });
  };

  const handleStartTimer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sub = formData.get("subject") as string;
    const top = formData.get("topic") as string;
    const dur = parseInt(formData.get("duration") as string, 10);
    const type = formData.get("timerType") as "pomodoro" | "stopwatch";

    tracker.startTimer(sub, top, dur, type);
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Study Session Tracker
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-light">
          Track focused sessions with our live timer, or log your completed hours manually.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Timer Panel */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border border-zinc-900 bg-zinc-950/45 shadow-2xl relative overflow-hidden">
            {/* Visual Indicator of Timer Active */}
            {tracker.isRunning && !tracker.isPaused && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 animate-pulse" />
            )}

            <CardHeader className="border-b border-zinc-900 pb-4">
              <CardTitle className="text-xl font-bold flex items-center space-x-2">
                <Clock className="w-5 h-5 text-violet-400" />
                <span>Live Focus Timer</span>
              </CardTitle>
              <CardDescription>
                Power through study tracks with the Pomodoro technique or incremental Stopwatch.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8 pb-6 flex flex-col items-center justify-center">
              {!tracker.isRunning ? (
                // Timer Setup Form
                <form onSubmit={handleStartTimer} className="w-full space-y-4 max-w-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timerType">Timer Mode</Label>
                      <select
                        id="timerType"
                        name="timerType"
                        className="flex h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                        defaultValue="pomodoro"
                      >
                        <option value="pomodoro">Pomodoro (Countdown)</option>
                        <option value="stopwatch">Stopwatch (Count-up)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timerDuration">Duration (Min)</Label>
                      <select
                        id="timerDuration"
                        name="duration"
                        className="flex h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                        defaultValue="25"
                      >
                        <option value="15">15 min</option>
                        <option value="25">25 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timerSubject">Subject Area</Label>
                    <Input
                      id="timerSubject"
                      name="subject"
                      required
                      placeholder="e.g. Next.js Development, DSA Practice"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timerTopic">Specific Topic</Label>
                    <Input
                      id="timerTopic"
                      name="topic"
                      required
                      placeholder="e.g. Auth.js v5 Setup, Binary Search Tree"
                    />
                  </div>

                  <Button type="submit" className="w-full mt-4">
                    Start Learning Session
                  </Button>
                </form>
              ) : (
                // Timer Display & Controls
                <div className="w-full flex flex-col items-center space-y-8">
                  {/* Timer Visual Ring / Dial */}
                  <div className="relative w-56 h-56 rounded-full border border-zinc-900 bg-zinc-950/80 flex flex-col items-center justify-center shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]">
                    {/* Pulsing indicator */}
                    <div className="absolute inset-4 rounded-full border border-dashed border-zinc-800" />
                    
                    <span className="text-4xl md:text-5xl font-mono font-extrabold text-white tracking-widest leading-none">
                      {tracker.timerType === "pomodoro"
                        ? formatTime(tracker.secondsRemaining)
                        : formatTime(tracker.secondsElapsed)}
                    </span>
                    <Badge variant="primary" className="mt-3.5 uppercase tracking-widest text-[9px]">
                      {tracker.timerType}
                    </Badge>
                  </div>

                  {/* Active session info */}
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-white">{tracker.subject}</h3>
                    <p className="text-sm text-zinc-400">Topic: {tracker.topic}</p>
                    <p className="text-xs text-zinc-500">
                      Elapsed: {Math.floor(tracker.secondsElapsed / 60)}m {tracker.secondsElapsed % 60}s
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-4">
                    {tracker.isPaused ? (
                      <Button
                        onClick={() => tracker.resumeTimer()}
                        variant="secondary"
                        className="w-12 h-12 p-0 rounded-full flex items-center justify-center border border-zinc-700"
                      >
                        <Play className="w-5 h-5 text-white" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => tracker.pauseTimer()}
                        variant="secondary"
                        className="w-12 h-12 p-0 rounded-full flex items-center justify-center border border-zinc-700"
                      >
                        <Pause className="w-5 h-5 text-zinc-300" />
                      </Button>
                    )}

                    <Button
                      onClick={() => tracker.resetStore()}
                      variant="outline"
                      className="w-12 h-12 p-0 rounded-full flex items-center justify-center border-zinc-800"
                      title="Reset Session"
                    >
                      <RotateCcw className="w-4 h-4 text-zinc-400" />
                    </Button>

                    <Button
                      onClick={handleLogActiveSession}
                      isLoading={isPending}
                      className="px-5 bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-500/20"
                    >
                      <Square className="w-3.5 h-3.5 mr-2" />
                      Save & Complete
                    </Button>
                  </div>

                  {/* Session Save Form overlays */}
                  <div className="w-full max-w-md border-t border-zinc-900 pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Productivity Rating</Label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-5 h-5 transition-colors ${
                                  star <= rating ? "fill-violet-400 text-violet-400" : "text-zinc-600"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="activeDiff">Difficulty</Label>
                        <select
                          id="activeDiff"
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="flex h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-white focus:outline-none"
                        >
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="activeNotes">Session Notes</Label>
                      <textarea
                        id="activeNotes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="What did you learn? Add links or codes snippets..."
                        rows={2}
                        className="flex w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500/80"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Manual Log & History Panel */}
        <div className="lg:col-span-5 space-y-8">
          {/* Notifications */}
          {error ? (
            <div className="bg-red-950/30 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-xs font-semibold">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Session saved successfully! Your streak is locked in.</span>
            </div>
          ) : null}

          {/* Manual Logger Form */}
          {!tracker.isRunning && (
            <Card className="border border-zinc-900 bg-zinc-950/45 shadow-2xl">
              <CardHeader className="border-b border-zinc-900 pb-4">
                <CardTitle className="text-xl font-bold flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span>Log Study Manually</span>
                </CardTitle>
                <CardDescription>
                  Already finished studying? Input your session details directly.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleLogManualSession} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manualSubject">Subject Area</Label>
                    <Input
                      id="manualSubject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="e.g. System Design, DSA Practice"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manualTopic">Topic Covered</Label>
                    <Input
                      id="manualTopic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      required
                      placeholder="e.g. Horizontal Scaling, Heap Sort"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="manualDuration">Duration (Min)</Label>
                      <Input
                        id="manualDuration"
                        type="number"
                        min="1"
                        required
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="45"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manualDiff">Difficulty</Label>
                      <select
                        id="manualDiff"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Productivity Rating</Label>
                    <div className="flex items-center space-x-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= rating ? "fill-violet-400 text-violet-400" : "text-zinc-700"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manualNotes">Session notes (Optional)</Label>
                    <textarea
                      id="manualNotes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write key bullet points or summary..."
                      rows={3}
                      className="flex w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500/80"
                    />
                  </div>

                  <Button type="submit" isLoading={isPending} className="w-full">
                    Log Study Session
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Recent Sessions list */}
          <Card className="border border-zinc-900 bg-zinc-950/45 shadow-2xl">
            <CardHeader className="border-b border-zinc-900 pb-4">
              <CardTitle className="text-lg font-bold flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Recent History</span>
              </CardTitle>
              <CardDescription>Your last study logs in this workspace.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentSessions.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-xs font-light">
                    No logged sessions found. Set your timer and start!
                  </div>
                ) : (
                  recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex flex-col space-y-2 p-3.5 bg-zinc-900/35 border border-zinc-900 rounded-xl"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[150px]">
                          {session.subject}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              session.difficultyLevel === "EASY"
                                ? "success"
                                : session.difficultyLevel === "MEDIUM"
                                ? "info"
                                : "warning"
                            }
                          >
                            {session.difficultyLevel}
                          </Badge>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {new Date(session.studyDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span className="truncate max-w-[170px]">{session.topic}</span>
                        <span className="font-semibold text-violet-400">{session.duration} min</span>
                      </div>

                      <div className="flex items-center space-x-1.5 pt-1 border-t border-zinc-900/50 mt-1">
                        <div className="flex items-center text-amber-400 text-[10px] space-x-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < session.productivityRating ? "fill-violet-400 text-violet-400" : "text-zinc-700"
                              }`}
                            />
                          ))}
                        </div>
                        {session.notes && (
                          <span className="text-[10px] text-zinc-500 truncate max-w-[200px]">
                            • {session.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
