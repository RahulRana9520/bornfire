import React from 'react';
import { TrendingUp, Clock, CheckCircle2, Flame, Award } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { WeeklyChart } from '@/components/progress/WeeklyChart';
import { Progress } from '@/components/ui/progress';
import { formatTimeDisplay, getLeagueName, xpForNextLevel } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';

const ProgressPage = () => {
  const { userProfile, getWeeklyProgress } = useTaskContext();
  const weeklyProgress = getWeeklyProgress();
  
  const xpToNext = xpForNextLevel(userProfile.level);
  const currentLevelXP = xpForNextLevel(userProfile.level - 1);
  const xpProgress = ((userProfile.xp - currentLevelXP) / (xpToNext - currentLevelXP)) * 100;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in pb-6">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2.5 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
          Daily Progress
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Track your productivity and growth
        </p>
      </div>

      {/* Profile Stats */}
      <div className="bg-gradient-to-br from-card to-accent/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-border/50 shadow-md hover:shadow-lg transition-all hover-lift">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar and basic info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20 shadow-lg">
              <span className="text-2xl sm:text-3xl font-bold text-primary">
                {userProfile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{userProfile.username}</h2>
              <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                <span className={cn(
                  "px-3 py-1 border-2 border-black text-xs sm:text-sm font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] rounded-none text-black",
                  `bg-league-${userProfile.league}`
                )}>
                  {getLeagueName(userProfile.league)} League
                </span>
              </div>
            </div>
          </div>

          {/* Level and XP */}
          <div className="flex-1 w-full sm:max-w-sm">
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span className="font-bold">Level {userProfile.level}</span>
              <span className="text-muted-foreground font-bold">{userProfile.xp} / {xpToNext} XP</span>
            </div>
            <Progress value={xpProgress} variant="gold" className="h-3 sm:h-3.5 shadow-inner" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50 shadow-md hover:shadow-lg transition-all hover-lift group">
          <div className="flex items-center gap-2 text-muted-foreground mb-2.5 sm:mb-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-primary transition-colors" />
            <span className="text-xs sm:text-sm font-bold">Total Focus Time</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {formatTimeDisplay(userProfile.totalFocusTime)}
          </div>
        </div>

        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50 shadow-md hover:shadow-lg transition-all hover-lift group">
          <div className="flex items-center gap-2 text-muted-foreground mb-2.5 sm:mb-3">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-success transition-colors" />
            <span className="text-xs sm:text-sm font-bold">Tasks Completed</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {userProfile.completedTasks}
          </div>
        </div>

        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50 shadow-md hover:shadow-lg transition-all hover-lift group">
          <div className="flex items-center gap-2 text-muted-foreground mb-2.5 sm:mb-3">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-warning transition-colors" />
            <span className="text-xs sm:text-sm font-bold">Current Streak</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-warning">
            {userProfile.streak} days
          </div>
        </div>

        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50 shadow-md hover:shadow-lg transition-all hover-lift group">
          <div className="flex items-center gap-2 text-muted-foreground mb-2.5 sm:mb-3">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-gold transition-colors" />
            <span className="text-xs sm:text-sm font-bold">Longest Streak</span>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {userProfile.longestStreak} days
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <WeeklyChart data={weeklyProgress} />

      {/* Badges */}
      <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 shadow-soft hover:shadow-md-enhanced transition-shadow">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
          <Award className="w-6 h-6 text-gold" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {userProfile.badges.map((badge) => (
            <div 
              key={badge.id}
              className="bg-gradient-to-br from-accent to-accent/70 rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg border border-border/50 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{badge.icon}</div>
              <div className="font-bold text-sm">{badge.name}</div>
              <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {badge.description}
              </div>
            </div>
          ))}
          
          {/* Locked badges placeholder */}
          <div className="bg-muted/50 rounded-2xl p-5 text-center opacity-60 border border-dashed border-muted-foreground/30">
            <div className="text-4xl mb-3">🔒</div>
            <div className="font-bold text-sm">50 Hours Focus</div>
            <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Focus for 50 hours total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
