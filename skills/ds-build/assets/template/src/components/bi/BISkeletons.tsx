import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeletons para Dashboard BI.
 * Todos os blocos usam <Skeleton /> do DS (bg-muted + animate-pulse),
 * preservando os mesmos containers (bg-card, border-border, rounded-lg)
 * dos cards reais para evitar layout shift.
 */

export function KPICardSkeleton() {
  return (
    <div className="bg-card border-l-4 border-border rounded-md p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-md" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function KPIGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="bg-card rounded-lg border border-border p-3">
      <Skeleton className="h-3 w-64 mb-3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ChartCardSkeleton({
  height = 280,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="w-full rounded-md" style={{ height }} />
    </div>
  );
}

export function PieCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <Skeleton className="h-4 w-40 mb-4" />
      <div className="flex items-center justify-center h-[200px]">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>
      <div className="space-y-2 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 4, cols = 7 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <div className="bg-primary/10 px-3 py-2 grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-3/4 bg-primary/20" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className={`px-3 py-2.5 grid gap-3 border-t border-border ${r % 2 ? "bg-muted/30" : ""}`}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
          >
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-3 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton apenas das linhas do tbody — usado ao paginar
 * (cabeçalho, título e paginação reais permanecem visíveis).
 */
export function TableRowsSkeleton({ rows = 4, cols = 7 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className={r % 2 === 0 ? "bg-card" : "bg-muted/30"}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-3 py-2.5">
              <Skeleton className="h-3 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/**
 * Skeleton da barra de paginação — status textual + controles.
 */
export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between mt-3">
      <Skeleton className="h-3 w-40" />
      <div className="flex items-center gap-1">
        <Skeleton className="h-7 w-7 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
    </div>
  );
}

