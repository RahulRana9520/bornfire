import React, { useState } from 'react';
import { Trophy, Users, Globe } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mergeSort } from '@/lib/taskUtils';

const Leaderboard = () => {
  const { leaderboard } = useTaskContext();
  const [filter, setFilter] = useState<'friends' | 'global'>('global');

  // Sort leaderboard using merge sort (as required)
  const sortedLeaderboard = mergeSort([...leaderboard]).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            <Trophy className="w-8 h-8 text-gold" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-base">
            Compete with other students
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'friends' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('friends')}
            className="transition-all shadow-sm"
          >
            <Users className="w-4 h-4 mr-2" />
            Friends
          </Button>
          <Button
            variant={filter === 'global' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('global')}
            className="transition-all shadow-sm"
          >
            <Globe className="w-4 h-4 mr-2" />
            Global
          </Button>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {sortedLeaderboard.slice(0, 3).map((entry, index) => {
          const heights = ['h-32', 'h-28', 'h-24'];
          const orders = [1, 0, 2];
          const bgColors = ['bg-gradient-to-t from-league-silver/20 to-league-silver/10', 'bg-gradient-to-t from-gold/20 to-gold/10', 'bg-gradient-to-t from-league-bronze/20 to-league-bronze/10'];
          const borderColors = ['border-league-silver', 'border-gold', 'border-league-bronze'];
          const actualIndex = orders[index];
          const actualEntry = sortedLeaderboard[actualIndex];
          
          return (
            <div 
              key={actualEntry.userId}
              className={cn(
                "flex flex-col items-center justify-end text-center group",
                index === 0 && "order-2",
                index === 1 && "order-1",
                index === 2 && "order-3"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center mb-3 border-2 shadow-lg transition-all group-hover:scale-110",
                actualEntry.isCurrentUser ? "bg-primary border-primary" : "bg-primary/10 border-primary/20"
              )}>
                <span className={cn(
                  "text-xl font-bold",
                  actualEntry.isCurrentUser ? "text-primary-foreground" : "text-primary"
                )}>
                  {actualEntry.username.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <span className="font-bold text-sm truncate max-w-full px-2">
                {actualEntry.username}
              </span>
              <span className="text-xs text-muted-foreground mb-3 font-semibold">
                {actualEntry.xp.toLocaleString()} XP
              </span>
              
              {/* Podium */}
              <div className={cn(
                "w-full rounded-t-2xl border-t-4 shadow-lg transition-all group-hover:shadow-xl",
                heights[actualIndex],
                bgColors[actualIndex],
                borderColors[actualIndex]
              )}>
                <div className="text-3xl font-bold mt-3 filter drop-shadow-md">
                  {actualIndex === 0 ? '🥇' : actualIndex === 1 ? '🥈' : '🥉'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full leaderboard */}
      <div className="space-y-3">
        {sortedLeaderboard.map((entry) => (
          <LeaderboardRow key={entry.userId} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
