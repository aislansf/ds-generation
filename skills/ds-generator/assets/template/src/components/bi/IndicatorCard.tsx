import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tooltip?: string;
  delta?: number | null; // % vs período anterior
}

export default function IndicatorCard({ title, value, icon: Icon, tooltip, delta }: Props) {
  const hasDelta = typeof delta === "number" && !Number.isNaN(delta);
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <Icon className="h-4 w-4 text-primary" />
          <span>{title}</span>
        </div>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="text-3xl font-bold text-foreground tabular-nums">{value}</div>
      <div className="mt-2 text-xs">
        {hasDelta ? (
          <span className={`inline-flex items-center gap-1 font-medium ${positive ? "text-emerald-600" : "text-rose-600"}`}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? "+" : ""}
            {delta}% vs período anterior
          </span>
        ) : (
          <span className="text-muted-foreground italic">Sem comparação disponível</span>
        )}
      </div>
    </div>
  );
}
