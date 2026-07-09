import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "info" | "outline";
}

export function Badge({ className = "", variant = "secondary", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none border";

  const variants = {
    primary: "bg-violet-950/40 text-violet-200 border-violet-500/20",
    secondary: "bg-zinc-800 text-zinc-300 border-zinc-700/50",
    success: "bg-emerald-950/40 text-emerald-200 border-emerald-500/20",
    warning: "bg-amber-950/40 text-amber-200 border-amber-500/20",
    info: "bg-cyan-950/40 text-cyan-200 border-cyan-500/20",
    outline: "bg-transparent text-zinc-400 border-zinc-800",
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />;
}
