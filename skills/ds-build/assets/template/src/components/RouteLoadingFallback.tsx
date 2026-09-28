import { useEffect, useState } from "react";

/**
 * Shown while a lazy route chunk is loading. Combines:
 *  - a thin top progress bar (immediate visual feedback)
 *  - a content skeleton (reduces perceived layout shift)
 */
export default function RouteLoadingFallback() {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    // Animate progress toward 90% while we wait; the bar disappears when
    // the real route mounts and unmounts this fallback.
    let raf = 0;
    const tick = () => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.08 : p));
      raf = window.setTimeout(tick, 120) as unknown as number;
    };
    tick();
    return () => window.clearTimeout(raf);
  }, []);

  return (
    <div
      className="min-h-screen bg-background"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Carregando página"
    >
      <div
        className="fixed top-0 left-0 h-0.5 bg-primary z-[100] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-in fade-in-0 duration-200">
        <div className="h-4 w-32 rounded bg-muted animate-pulse" />
        <div className="h-9 w-2/3 rounded bg-muted animate-pulse" />
        <div className="h-4 w-full max-w-xl rounded bg-muted/70 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-lg bg-muted/70 animate-pulse" />
      </div>
      <span className="sr-only">Carregando conteúdo da página…</span>
    </div>
  );
}