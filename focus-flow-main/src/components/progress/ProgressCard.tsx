import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  value: number;
  max?: number;
  unit?: string;
  variant?: 'default' | 'success' | 'warning' | 'primary' | 'gold';
  icon?: React.ReactNode;
  showPercentage?: boolean;
}

export function ProgressCard({
  title,
  value,
  max = 100,
  unit = '%',
  variant = 'primary',
  icon,
  showPercentage = true,
}: ProgressCardProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="bg-card rounded-xl sm:rounded-2xl p-3.5 sm:p-4 lg:p-5 border border-border/50 shadow-md hover:shadow-lg transition-all hover-lift group">
      <div className="flex flex-col gap-2 mb-2.5">
        <div className="flex items-center justify-between">
          {icon && <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">{icon}</span>}
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}{unit}
          </span>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-muted-foreground">{title}</span>
      </div>
      <Progress value={percentage} variant={variant} className="h-2 sm:h-2.5" />
      {showPercentage && max !== 100 && (
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 font-medium">
          {percentage}% of {max}{unit}
        </p>
      )}
    </div>
  );
}
