import React from 'react';
import { LeaderboardEntry } from '@/types/task';
import { cn } from '@/lib/utils';
import { getLeagueName } from '@/lib/taskUtils';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-gold" />;
      case 2:
        return <Medal className="w-5 h-5 text-league-silver" />;
      case 3:
        return <Award className="w-5 h-5 text-league-bronze" />;
      default:
        return <span className="w-5 text-center font-semibold text-muted-foreground">{rank}</span>;
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl shadow-soft",
      "transition-all duration-200 hover:shadow-md-enhanced hover-lift",
      entry.isCurrentUser 
        ? "bg-primary/5 border-2 border-primary/30 ring-2 ring-primary/10" 
        : "bg-card border border-border/50 hover:border-border"
    )}>
      {/* Rank */}
      <div className="w-8 flex justify-center flex-shrink-0">
        {getRankIcon(entry.rank)}
      </div>

      {/* Avatar */}
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm flex-shrink-0",
        entry.isCurrentUser ? "bg-primary text-primary-foreground border-primary" : "bg-primary/10 border-primary/20"
      )}>
        <span className={cn(
          "font-bold text-lg",
          entry.isCurrentUser ? "" : "text-primary"
        )}>
          {entry.username.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-semibold truncate text-base",
            entry.isCurrentUser && "text-primary"
          )}>
            {entry.username}
          </span>
          {entry.isCurrentUser && (
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">(You)</span>
          )}
        </div>
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-bold text-primary-foreground inline-block mt-1.5 shadow-sm",
          `league-${entry.league}`
        )}>
          {getLeagueName(entry.league)}
        </span>
      </div>

      {/* XP */}
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{entry.xp.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground font-semibold">XP</div>
      </div>
    </div>
  );
}
