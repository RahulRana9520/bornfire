import React from 'react';
import { Friend } from '@/types/task';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { getLeagueName } from '@/lib/taskUtils';

interface FriendCardProps {
  friend: Friend;
}

export function FriendCard({ friend }: FriendCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl p-4 border border-border/50 shadow-soft",
      "transition-all duration-200 hover:shadow-md hover:border-border"
    )}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {friend.username.charAt(0)}
            </span>
          </div>
          {/* Online indicator */}
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card",
            friend.isOnline ? "bg-success" : "bg-muted"
          )} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium truncate">{friend.username}</span>
            <span className={cn(
              "px-2 py-0.5 border border-black text-[10px] font-black uppercase tracking-wide shadow-[1px_1px_0px_0px_#000] rounded-none text-black",
              `bg-league-${friend.league}`
            )}>
              {getLeagueName(friend.league)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            {friend.isWorking ? (
              <>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>Working now</span>
              </>
            ) : friend.isOnline ? (
              <span>Online</span>
            ) : (
              <span>Offline</span>
            )}
          </div>

          {/* Daily progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Today's progress</span>
              <span className="font-medium">{friend.dailyProgress}%</span>
            </div>
            <Progress 
              value={friend.dailyProgress} 
              variant={friend.dailyProgress === 100 ? 'success' : 'primary'}
              className="h-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
