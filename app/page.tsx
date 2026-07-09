"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  Clock,
  Compass,
  Bookmark,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between">
      {/* Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass-card border-x-0 border-t-0 border-b border-zinc-900/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            Evolyft
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <Button size="sm" className="hidden sm:inline-flex">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-6 py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col space-y-8 text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-zinc-900/80 border border-zinc-800 rounded-full px-4 py-1.5 w-fit">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-zinc-300">
                AI-Ready Learning Intelligence Platform
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans"
            >
              Elevate the way you <span className="accent-gradient-text">learn.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-zinc-400 leading-relaxed font-light max-w-xl"
            >
              Evolyft is a gorgeous, minimal, and futuristic learning assistant that helps you build daily consistency, structure roadmaps, and organize resources.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started for Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </a>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-900 max-w-md"
            >
              <div>
                <p className="text-2xl font-bold text-white">96%</p>
                <p className="text-xs text-zinc-500 font-medium">Goal Success Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">4.8★</p>
                <p className="text-xs text-zinc-500 font-medium">User Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">2.5M+</p>
                <p className="text-xs text-zinc-500 font-medium">Minutes Tracked</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring" as const, stiffness: 60, damping: 15, delay: 0.3 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="relative w-full max-w-[420px]"
            >
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-cyan-500/20 rounded-3xl blur-2xl -z-10" />

              {/* Mockup Card */}
              <Card className="border border-zinc-800 bg-zinc-950/70 p-6 flex flex-col space-y-6 shadow-2xl relative">
                
                {/* Mock Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center border border-violet-500/20">
                      <Flame className="w-5 h-5 text-violet-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Daily Streak</h4>
                      <p className="text-xs text-zinc-400">Consistency Habit</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-violet-400">14 Days</span>
                  </div>
                </div>

                {/* Mock Activity Tracking */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">Next.js 15 Masterclass</span>
                    <span className="text-zinc-500">80% Done</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Mock Activities list */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-3 bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-zinc-300">Milestone: Middleware Protection</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-zinc-300">Tracked: 1h 45m focused session</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10 px-6 bg-zinc-950/20 border-t border-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Features designed for execution.</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">Stop collecting tutorials. Start compiling milestones and mastering consistency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card hoverEffect className="border border-zinc-900">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center mb-6 border border-violet-500/10">
                <Flame className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-sans">Consistency Streak</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">Monitor daily active learning. Watch your streak metrics thrive with automated activity logging.</p>
            </Card>

            {/* Feature 2 */}
            <Card hoverEffect className="border border-zinc-900">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/10 flex items-center justify-center mb-6 border border-cyan-500/10">
                <Compass className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-sans">Study Roadmaps</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">Break complex subjects down into systematic tracks, milestones, and deadlines with complete progress indicators.</p>
            </Card>

            {/* Feature 3 */}
            <Card hoverEffect className="border border-zinc-900">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center mb-6 border border-indigo-500/10">
                <Clock className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-sans">Session Tracker</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">Log focused study hours with customizable difficulty ratings, detailed log diaries, and live timers.</p>
            </Card>

            {/* Feature 4 */}
            <Card hoverEffect className="border border-zinc-900">
              <div className="w-12 h-12 rounded-xl bg-pink-600/10 flex items-center justify-center mb-6 border border-pink-500/10">
                <Bookmark className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-sans">Resource Vault</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">Catalog articles, videos, and developer documentation with intuitive status tagging and search filtering.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full glass-card border-x-0 border-b-0 border-t border-zinc-900/60 px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 mt-auto">
        <p>© {new Date().getFullYear()} Evolyft. Elevate the way you learn.</p>
        <div className="flex space-x-6 mt-3 sm:mt-0 font-medium">
          <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
