import React, { useState } from 'react';
import { Trophy, Users, Globe } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mergeSort } from '@/lib/taskUtils';
import { LeaderboardEntry } from '@/types/task';

const Leaderboard = () => {
  const { leaderboard, friends, userProfile } = useTaskContext();
  const [filter, setFilter] = useState<'friends' | 'global'>('friends');

  // Derive display data based on filter
  const displayData = React.useMemo(() => {
    if (filter === 'global') return leaderboard;
    
    // Friends view: Current User + All Friends
    const friendEntries: LeaderboardEntry[] = [
      {
        userId: userProfile.id,
        username: userProfile.username,
        xp: userProfile.xp,
        league: userProfile.league,
        isCurrentUser: true,
        rank: 0,
      },
      ...friends.map(f => ({
        userId: f.id,
        username: f.username,
        xp: f.xp,
        league: f.league,
        rank: 0,
      }))
    ];
    return friendEntries;
  }, [filter, leaderboard, friends, userProfile]);

  // Sort leaderboard using merge sort (as required)
  const sortedLeaderboard = mergeSort([...displayData]).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase italic tracking-tighter bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent pr-2 sm:pr-6 overflow-visible">
            LEADERBOARD
          </h1>
          <p className="text-muted-foreground text-base font-medium">
            Compete with {filter === 'friends' ? 'your friends' : 'other students'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          <Button
            id="tour-friend-rank"
            variant={filter === 'friends' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('friends')}
            className="transition-all shadow-sm"
          >
            <Users className="w-4 h-4 mr-2" />
            Friends
          </Button>
          <Button
            id="tour-global-rank"
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
      {sortedLeaderboard.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-8">
          {[1, 0, 2].map((actualIndex) => {
            const actualEntry = sortedLeaderboard[actualIndex];
            if (!actualEntry) return <div key={`empty-${actualIndex}`} />;

            const heights = ['h-32', 'h-28', 'h-24'];
            const bgColors = ['bg-gradient-to-t from-league-silver/20 to-league-silver/10', 'bg-gradient-to-t from-gold/20 to-gold/10', 'bg-gradient-to-t from-league-bronze/20 to-league-bronze/10'];
            const borderColors = ['border-league-silver', 'border-gold', 'border-league-bronze'];
            const podiumOrder = [ 'order-2', 'order-1', 'order-3' ];
            
            return (
              <div 
                key={actualEntry.userId}
                className={cn(
                  "flex flex-col items-center justify-end text-center group",
                  podiumOrder[actualIndex]
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
      )}

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
