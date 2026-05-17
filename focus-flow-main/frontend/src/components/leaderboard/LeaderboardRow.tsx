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
        <div className="flex items-center flex-wrap gap-2.5">
          {/* League Icon Shield in front of name */}
          <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center p-0.5 bg-white border-[2px] border-black shadow-[1.5px_1.5px_0px_0px_#000]">
            <img 
              src={`/badges/${entry.league}.png`} 
              alt={entry.league} 
              className="w-full h-full object-contain" 
            />
          </div>

          <span className={cn(
            "font-black uppercase text-base truncate",
            entry.isCurrentUser && "text-primary"
          )}>
            {entry.username}
          </span>
          {entry.isCurrentUser && (
            <span className="text-[9px] font-black uppercase bg-black text-white px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000] rounded-none">
              (You)
            </span>
          )}
          
          {/* League Name Badge */}
          <span className={cn(
            "px-2 py-0.5 border-2 border-black text-[9px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_#000] rounded-none text-black ml-1",
            `bg-league-${entry.league}`
          )}>
            {getLeagueName(entry.league)} League
          </span>
        </div>
      </div>

      {/* XP */}
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{entry.xp.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground font-semibold">XP</div>
      </div>
    </div>
  );
}
