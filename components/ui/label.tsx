import * as React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`text-xs font-semibold uppercase tracking-wider text-zinc-400 select-none ${className}`}
      {...props}
    />
  );
}
