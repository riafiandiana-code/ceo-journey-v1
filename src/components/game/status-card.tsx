import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatusCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  progress?: number;
  progressColor?: string;
  className?: string;
}

export function StatusCard({ label, value, icon, progress, progressColor, className }: StatusCardProps) {
  return (
    <div className={cn("bg-card p-4 rounded-xl shadow-sm border flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground p-2 bg-secondary rounded-lg">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-1">
          <Progress value={progress} className="h-1.5" indicatorClassName={progressColor} />
        </div>
      )}
    </div>
  );
}