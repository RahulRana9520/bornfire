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
    <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft hover:shadow-md-enhanced transition-all hover-lift group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>}
          <span className="text-sm font-semibold text-muted-foreground">{title}</span>
        </div>
        <span className="text-xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {value}{unit}
        </span>
      </div>
      <Progress value={percentage} variant={variant} className="h-2.5" />
      {showPercentage && max !== 100 && (
        <p className="text-xs text-muted-foreground mt-2.5 font-medium">
          {percentage}% of {max}{unit}
        </p>
      )}
    </div>
  );
}
