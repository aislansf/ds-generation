import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-ds="input"
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-control)] border-[length:var(--control-border-width)] border-[color:var(--control-border)] bg-background px-3 py-2 text-base text-[color:var(--control-foreground)] ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[color:var(--control-placeholder-input)] hover:border-[color:var(--control-border)] focus:border-[color:var(--control-border-hover)] focus-visible:border-[color:var(--control-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--control-border-hover)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
