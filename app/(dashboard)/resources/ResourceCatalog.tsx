"use client";

import React, { useState, useTransition } from "react";
import { saveResource, toggleFavoriteResource, deleteResource } from "@/actions/resources";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bookmark,
  Search,
  Plus,
  Star,
  Trash2,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  FileCode,
  Tag,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
}

interface ResourceCatalogProps {
  initialResources: Resource[];
}

export default function ResourceCatalog({ initialResources }: ResourceCatalogProps) {
  const [isPending, startTransition] = useTransition();
  const [resources, setResources] = useState<Resource[]>(initialResources);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("ARTICLE");
  const [tagsInput, setTagsInput] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL"); // ALL, ARTICLE, VIDEO, DOCUMENTATION, NOTE, FAVORITE
  const [error, setError] = useState<string | null>(null);

  // Sync state with parent updates
  React.useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  const handleToggleFavorite = async (resourceId: string, currentFav: boolean) => {
    // Optimistic UI updates
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, isFavorite: !currentFav } : r))
    );

    startTransition(async () => {
      await toggleFavoriteResource(resourceId, !currentFav);
    });
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Remove this bookmark?")) return;

    // Optimistic update
    setResources((prev) => prev.filter((r) => r.id !== resourceId));

    startTransition(async () => {
      await deleteResource(resourceId);
    });
  };

  const handleCreateResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tagsInput);

    startTransition(async () => {
      const response = await saveResource(null, formData);
      if (response?.error) {
        setError(response.error);
      } else {
        // Clear
        setTitle("");
        setUrl("");
        setDescription("");
        setCategory("ARTICLE");
        setTagsInput("");
        setShowAddForm(false);
      }
    });
  };

  // Filter & search calculations
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === "ALL") return true;
    if (selectedFilter === "FAVORITE") return resource.isFavorite;
    return resource.category === selectedFilter;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "ARTICLE":
        return <BookOpen className="w-4 h-4 text-violet-400" />;
      case "VIDEO":
        return <Video className="w-4 h-4 text-pink-400" />;
      case "DOCUMENTATION":
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      case "NOTE":
        return <FileText className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bookmark className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Sub-header actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by title, tag, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10.5 rounded-xl border border-zinc-900 bg-zinc-950/50 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500/80"
          />
        </div>

        {/* Create Button */}
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="secondary" className="h-10 px-4 rounded-xl text-xs font-semibold self-end md:self-auto">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Bookmark
        </Button>
      </div>

      {/* Save Resource Card Form */}
      {showAddForm && (
        <Card className="border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl max-w-2xl">
          <CardHeader className="p-0 pb-4 border-b border-zinc-900 flex flex-col space-y-1">
            <CardTitle className="text-lg font-bold">Add Bookmark Link</CardTitle>
            <CardDescription>Save reference documentations, tutorials, or notes for quick access.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <form onSubmit={handleCreateResourceSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-950/30 text-red-400 border border-red-500/20 px-3 py-2 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="resTitle">Resource Title</Label>
                  <Input
                    id="resTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Next.js 15 Middleware Docs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="resCategory">Category</Label>
                  <select
                    id="resCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="ARTICLE">Article / Blog</option>
                    <option value="VIDEO">Video Tutorial</option>
                    <option value="DOCUMENTATION">Official Documentation</option>
                    <option value="NOTE">Study Note</option>
                    <option value="OTHER">Other Link</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="resUrl">Bookmark URL</Label>
                <Input
                  id="resUrl"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://nextjs.org/docs/..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="resDesc">Description (Optional)</Label>
                  <Input
                    id="resDesc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short summary of this reference..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="resTags">Tags (Comma-separated)</Label>
                  <Input
                    id="resTags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="nextjs, routing, middleware"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-900">
                <Button type="button" onClick={() => setShowAddForm(false)} variant="outline" className="h-10 px-4 text-xs">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isPending} className="h-10 px-5 text-xs">
                  Save Bookmark
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-4 select-none">
        {[
          { key: "ALL", label: "All References" },
          { key: "ARTICLE", label: "Articles" },
          { key: "VIDEO", label: "Videos" },
          { key: "DOCUMENTATION", label: "Docs" },
          { key: "NOTE", label: "Notes" },
          { key: "FAVORITE", label: "Favorites" },
        ].map((filter) => {
          const isActive = selectedFilter === filter.key;
          return (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isActive
                  ? "bg-violet-600/10 border-violet-500/30 text-white shadow-sm"
                  : "bg-zinc-900/10 border-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Bookmarks Catalog Grid */}
      {filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-zinc-900 rounded-3xl bg-zinc-950/10">
          <Bookmark className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No bookmarked references</h3>
          <p className="text-xs text-zinc-500 text-center max-w-xs font-light leading-relaxed">
            Search filters returned empty, or you haven&apos;t cataloged any study materials yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className="border border-zinc-900 bg-zinc-950/45 p-5 hover:border-zinc-800/80 transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Category, Favorite, Delete toolbar */}
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center space-x-2.5">
                  {getCategoryIcon(resource.category)}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    {resource.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleFavorite(resource.id, resource.isFavorite)}
                    className="p-1 text-zinc-500 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        resource.isFavorite ? "fill-amber-400 text-amber-400 animate-pulse" : "text-zinc-600"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1.5 flex-1 min-h-[70px]">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-start text-sm font-bold text-zinc-100 hover:text-violet-400 transition-colors leading-tight"
                >
                  <span className="line-clamp-2">{resource.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 mt-0.5 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                </a>

                {resource.description && (
                  <p className="text-xs text-zinc-500 font-light line-clamp-2 leading-relaxed">
                    {resource.description}
                  </p>
                )}
              </div>

              {/* Tags & Time */}
              <div className="pt-4 border-t border-zinc-900/60 mt-4 flex flex-col space-y-3">
                {/* Tags array list */}
                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {resource.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center text-[10px] font-semibold text-zinc-400 bg-zinc-900/50 border border-zinc-850 px-2 py-0.5 rounded-md"
                      >
                        <Tag className="w-2.5 h-2.5 text-zinc-500 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center text-[9px] text-zinc-600 font-mono">
                  <span>
                    Saved:{" "}
                    {new Date(resource.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
