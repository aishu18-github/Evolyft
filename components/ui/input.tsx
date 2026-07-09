import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={`flex h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-3.5 py-2 text-sm text-white placeholder-zinc-500 transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/80 focus-visible:border-violet-500/80 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-red-500/50 focus-visible:ring-red-500" : ""
          } ${className}`}
          ref={ref}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-red-400 font-medium pl-1">{error}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
