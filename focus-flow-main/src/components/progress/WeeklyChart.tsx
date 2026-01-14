import React from 'react';
import { cn } from '@/lib/utils';

interface WeeklyChartProps {
  data: number[];
  className?: string;
}

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeeklyChart({ data, className }: WeeklyChartProps) {
  // Rotate data to start from Monday of the current week
  const today = new Date().getDay();
  const mondayOffset = today === 0 ? 6 : today - 1;
  
  return (
    <div className={cn("bg-card rounded-2xl p-5 border border-border/50 shadow-soft hover:shadow-md-enhanced transition-shadow hover-lift", className)}>
      <h3 className="font-bold text-base mb-5">Weekly Consistency</h3>
      
      <div className="flex items-end justify-between gap-2.5 h-36">
        {data.map((value, index) => {
          const isToday = index === data.length - 1;
          const height = Math.max(10, (value / 100) * 100);
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 gap-2.5 group/bar">
              <div className="relative w-full flex items-end justify-center h-28">
                <div
                  className={cn(
                    "w-full max-w-10 rounded-t-lg transition-all duration-500 group-hover/bar:scale-105",
                    value === 100 ? "bg-gradient-to-t from-success to-success/80 shadow-lg shadow-success/20" : 
                    value > 0 ? "bg-gradient-to-t from-primary to-primary/80 shadow-md shadow-primary/10" : 
                    "bg-muted",
                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-card"
                  )}
                  style={{ height: `${height}%` }}
                />
                {value > 0 && (
                  <span className="absolute -top-6 text-xs font-bold text-muted-foreground group-hover/bar:text-foreground transition-colors">
                    {value}%
                  </span>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isToday ? "font-bold text-primary" : "text-muted-foreground"
              )}>
                {dayLabels[(mondayOffset + index - 6 + 7) % 7]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
