"use client";

import React, { useState, useTransition } from "react";
import { toggleMilestone, deleteRoadmap, createRoadmap } from "@/actions/roadmaps";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  CheckCircle,
  Plus,
  Trash2,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  order: number;
  isCompleted: boolean;
}

interface Roadmap {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  createdAt: Date;
  milestones: Milestone[];
}

interface RoadmapListProps {
  initialRoadmaps: Roadmap[];
}

export default function RoadmapList({ initialRoadmaps }: RoadmapListProps) {
  const [isPending, startTransition] = useTransition();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(initialRoadmaps);
  
  // Create roadmap states
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [milestones, setMilestones] = useState<string[]>(["", ""]);

  const [expandedRoadmap, setExpandedRoadmap] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync state with parent props updates
  React.useEffect(() => {
    setRoadmaps(initialRoadmaps);
  }, [initialRoadmaps]);

  const handleToggleMilestone = async (roadmapId: string, milestoneId: string, currentStatus: boolean) => {
    // Optimistic UI updates
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id === roadmapId) {
          const updatedMilestones = r.milestones.map((m) =>
            m.id === milestoneId ? { ...m, isCompleted: !currentStatus } : m
          );
          const completedCount = updatedMilestones.filter((m) => m.isCompleted).length;
          const status = completedCount === updatedMilestones.length ? "COMPLETED" : "IN_PROGRESS";
          return { ...r, milestones: updatedMilestones, status };
        }
        return r;
      })
    );

    startTransition(async () => {
      await toggleMilestone(milestoneId, !currentStatus);
    });
  };

  const handleDeleteRoadmap = async (roadmapId: string) => {
    if (!confirm("Are you sure you want to delete this roadmap?")) return;

    // Optimistic update
    setRoadmaps((prev) => prev.filter((r) => r.id !== roadmapId));

    startTransition(async () => {
      await deleteRoadmap(roadmapId);
    });
  };

  const handleAddMilestoneInput = () => {
    setMilestones([...milestones, ""]);
  };

  const handleRemoveMilestoneInput = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneValueChange = (index: number, val: string) => {
    const updated = [...milestones];
    updated[index] = val;
    setMilestones(updated);
  };

  const handleCreateRoadmapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    
    milestones.forEach((milestone) => {
      if (milestone.trim() !== "") {
        formData.append("milestones[]", milestone);
      }
    });

    startTransition(async () => {
      const result = await createRoadmap(null, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        // Clear forms
        setTitle("");
        setDescription("");
        setCategory("Frontend");
        setMilestones(["", ""]);
        setShowAddForm(false);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Action Header bar */}
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-violet-400" />
          <span>Active Tracks</span>
        </h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="secondary" className="h-10 px-4 rounded-xl text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Create Roadmap
        </Button>
      </div>

      {/* New Roadmap Creation Panel */}
      {showAddForm && (
        <Card className="border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl max-w-2xl">
          <CardHeader className="p-0 pb-4 border-b border-zinc-900 flex flex-col space-y-1">
            <CardTitle className="text-lg font-bold">New Learning Track</CardTitle>
            <CardDescription>Structure your subjects into detailed progressive milestone checklists.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <form onSubmit={handleCreateRoadmapSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-950/30 text-red-400 border border-red-500/20 px-3 py-2 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="roadTitle">Track Title</Label>
                  <Input
                    id="roadTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Master React & Next.js 15"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="roadCategory">Category</Label>
                  <select
                    id="roadCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="Frontend">Frontend Development</option>
                    <option value="Backend">Backend Development</option>
                    <option value="DSA">Data Structures & Algo</option>
                    <option value="AI/ML">AI & Machine Learning</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="roadDesc">Short Description</Label>
                <textarea
                  id="roadDesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is your main goal for this track? Add target completion dates..."
                  rows={2}
                  className="flex w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500/85"
                />
              </div>

              {/* Milestones dynamic list builder */}
              <div className="space-y-3 pt-2">
                <Label>Milestone Checkpoints (Ordered)</Label>
                <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                  {milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="text-xs text-zinc-500 font-mono w-4">{idx + 1}.</div>
                      <Input
                        value={milestone}
                        onChange={(e) => handleMilestoneValueChange(idx, e.target.value)}
                        required={idx === 0}
                        placeholder={`Milestone checkpoint #${idx + 1}`}
                        className="bg-zinc-950/40 h-9.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestoneInput(idx)}
                        disabled={milestones.length <= 1}
                        className="p-2 text-zinc-500 hover:text-red-400 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={handleAddMilestoneInput}
                  variant="ghost"
                  className="h-8 text-xs text-violet-400 hover:text-violet-300 px-3 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Milestone
                </Button>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-900">
                <Button type="button" onClick={() => setShowAddForm(false)} variant="outline" className="h-10 px-4 text-xs">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isPending} className="h-10 px-5 text-xs">
                  Create Learning Track
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Roadmaps catalog grid */}
      {roadmaps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-zinc-900 rounded-3xl bg-zinc-950/10">
          <Compass className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No roadmaps created yet</h3>
          <p className="text-xs text-zinc-500 text-center max-w-xs font-light leading-relaxed">
            Break down complex technologies or courses into modular milestones to gamify your learn progression.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmaps.map((roadmap) => {
            const completedCount = roadmap.milestones.filter((m) => m.isCompleted).length;
            const totalCount = roadmap.milestones.length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const isCompleted = roadmap.status === "COMPLETED";
            const isExpanded = expandedRoadmap === roadmap.id;

            return (
              <Card key={roadmap.id} className="border border-zinc-900 bg-zinc-950/45 p-6 hover:border-zinc-800/80 transition-all duration-300 relative group flex flex-col justify-between">
                
                <div>
                  {/* Category & options */}
                  <div className="flex items-center justify-between pb-3">
                    <Badge variant={isCompleted ? "success" : "primary"}>
                      {roadmap.category}
                    </Badge>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteRoadmap(roadmap.id)}
                        className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Roadmap"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpandedRoadmap(isExpanded ? null : roadmap.id)}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Title & desc */}
                  <div className="space-y-1">
                    <h3 className={`text-lg font-bold tracking-tight text-white ${isCompleted ? "line-through text-zinc-500" : ""}`}>
                      {roadmap.title}
                    </h3>
                    {roadmap.description && (
                      <p className="text-xs text-zinc-500 font-light line-clamp-2">
                        {roadmap.description}
                      </p>
                    )}
                  </div>

                  {/* Completion Progress bar */}
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-500">Milestones Complete</span>
                      <span className={`font-semibold ${isCompleted ? "text-emerald-400" : "text-violet-400"}`}>
                        {completedCount}/{totalCount} ({progress}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900/50 h-2 rounded-full overflow-hidden border border-zinc-900/80">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-violet-500 to-indigo-400"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Milestones Checklist expanded view */}
                {isExpanded && (
                  <div className="mt-6 pt-5 border-t border-zinc-900/80 space-y-3 transition-all duration-300">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Milestones checklist</span>
                    </h4>
                    <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                      {roadmap.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          onClick={() => handleToggleMilestone(roadmap.id, milestone.id, milestone.isCompleted)}
                          className="flex items-center space-x-3 p-2.5 rounded-lg bg-zinc-900/20 border border-zinc-900/60 hover:bg-zinc-900/40 hover:border-zinc-800/80 cursor-pointer select-none transition-all group/item"
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              milestone.isCompleted
                                ? "bg-violet-600 border-violet-500 text-white"
                                : "border-zinc-700 group-hover/item:border-zinc-500"
                            }`}
                          >
                            {milestone.isCompleted && <CheckCircle className="w-3 h-3 text-white fill-white" />}
                          </div>
                          <span
                            className={`text-xs ${
                              milestone.isCompleted ? "line-through text-zinc-500" : "text-zinc-200"
                            }`}
                          >
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
