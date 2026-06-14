import React from 'react';
import { cn } from '@/lib/utils';
import { BarChart3, Zap, CheckCircle2, TrendingUp, Clock, Star } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  value: number;
  max?: number;
  unit?: string;
  variant?: 'default' | 'success' | 'warning' | 'primary' | 'gold';
  icon?: string | React.ReactNode;
  showPercentage?: boolean;
}

const getIcon = (iconName: string | React.ReactNode) => {
  if (typeof iconName !== 'string') return iconName;
  
  switch (iconName) {
    case '📊': return <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />;
    case '⏱️': return <Clock className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />;
    case '✅': return <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />;
    case '⭐': return <Star className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />;
    default: return <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />;
  }
};

const getIconColor = (title: string) => {
  if (title.includes('Progress')) return 'bg-[#FF89BB]'; // Pink
  if (title.includes('Focus')) return 'bg-[#FFDE00]';    // Yellow
  if (title.includes('Completed')) return 'bg-[#00E5BC]'; // Teal
  if (title.includes('XP')) return 'bg-[#FF89BB]';       // Pink
  return 'bg-[#FFDE00]';
};

export function ProgressCard({ 
  title, 
  value, 
  max = 100, 
  unit = '%', 
  variant = 'primary',
  icon,
  showPercentage = true
}: ProgressCardProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const stickerColor = getIconColor(title);
  
  return (
    <div className="bg-white border-[2px] sm:border-[3px] border-black p-3 sm:p-5 shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] space-y-3 sm:space-y-5 transition-none">
      <div className="flex items-start justify-between gap-2">
        {/* The Sticker Icon */}
        <div className={cn(
          "w-9 h-9 sm:w-12 sm:h-12 border-[2px] sm:border-[3px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] flex-shrink-0",
          stickerColor
        )}>
          {getIcon(icon)}
        </div>
        
        <div className="text-right min-w-0">
          <span className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">
            {value}{unit}
          </span>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#555] leading-tight">
          {title}
        </h4>
        
        <div className="relative h-3 sm:h-4 border-[2px] sm:border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_#000] overflow-hidden">
          <div 
            className="h-full bg-[#FF89BB] border-r-[2px] sm:border-r-[3px] border-black transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {showPercentage && max !== 100 && (
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight">
            {Math.round((value / max) * 100)}% of {max}{unit}
          </p>
        )}
      </div>
    </div>
  );
}
