"use client";

import * as React from "react";
import { motion } from "framer-motion";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "style" | "onAnimationStart" | "onDragOver" | "onDragEnter" | "onDragLeave"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50 select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.5)] border border-violet-500/30",
    secondary:
      "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700/50",
    outline:
      "border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-900/50 hover:border-zinc-500",
    ghost:
      "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
    danger:
      "bg-red-950/40 text-red-200 hover:bg-red-900/60 border border-red-500/20",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.985 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-white" />
      ) : null}
      {children}
    </motion.button>
  );
}
