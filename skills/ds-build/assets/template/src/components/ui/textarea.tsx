import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      data-ds="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-[var(--radius-control)] border-[length:var(--control-border-width)] border-[color:var(--control-border)] bg-background px-3 py-2 text-sm text-[color:var(--control-foreground)] ring-offset-background transition-colors placeholder:text-[color:var(--control-placeholder-input)] hover:border-[color:var(--control-border)] focus:border-[color:var(--control-border-hover)] focus-visible:border-[color:var(--control-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--control-border-hover)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
