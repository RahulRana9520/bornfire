import React from 'react';
import { TrendingUp, Clock, CheckCircle2, Flame, Award, Target, Trophy } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { WeeklyChart } from '@/components/progress/WeeklyChart';
import { formatTimeDisplay, getLeagueName, xpForNextLevel } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';
import { useCombinedProgress } from '@/hooks/useCombinedProgress';

const ProgressPage = () => {
  const { userProfile } = useTaskContext();
  const { weeklyProgress } = useCombinedProgress();
  
  const xpToNext = xpForNextLevel(userProfile.level);
  const currentLevelXP = xpForNextLevel(userProfile.level - 1);
  const xpProgress = ((userProfile.xp - currentLevelXP) / (xpToNext - currentLevelXP)) * 100;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in pb-4">
      {/* Header */}
      <div className="bg-[#FFDE00] border-[2px] sm:border-[4px] border-black p-4 sm:p-6 lg:p-8 shadow-[3px_3px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-2 sm:gap-3">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3px]" />
              Daily Progress
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-70">
              Track your productivity and growth
            </p>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="bg-white border-[2px] sm:border-[4px] border-black p-4 sm:p-6 lg:p-8 shadow-[3px_3px_0px_0px_#00E5BC] sm:shadow-[8px_8px_0px_0px_#00E5BC]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#FF89BB] border-[2px] sm:border-[4px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] shrink-0">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-black">
              {userProfile.username.charAt(0)}
            </span>
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter">{userProfile.username}</h2>
              <span className={cn(

                "px-3 py-1 border-[3px] border-black text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]",
                `bg-league-${userProfile.league}`
              )}>
                {getLeagueName(userProfile.league)} League
              </span>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-xs sm:text-sm font-black uppercase tracking-widest mb-2">
                <span>Level {userProfile.level}</span>
                <span>{userProfile.xp} / {xpToNext} XP</span>
              </div>
              <div className="h-4 border-[3px] border-black bg-white overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                <div 
                  className="h-full bg-[#00E5BC] border-r-[3px] border-black transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, xpProgress))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-[#FFDE00] border-[2px] sm:border-[4px] border-black p-4 sm:p-6 shadow-[3px_3px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[4px_4px_0px_0px_#000] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 stroke-[3px]" />
            <span className="text-xs font-black uppercase tracking-widest">Focus Time</span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter">
            {formatTimeDisplay(userProfile.totalFocusTime)}
          </div>
        </div>

        <div className="bg-[#00E5BC] border-[2px] sm:border-[4px] border-black p-4 sm:p-6 shadow-[3px_3px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[4px_4px_0px_0px_#000] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 stroke-[3px]" />
            <span className="text-xs font-black uppercase tracking-widest">Completed</span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter">
            {userProfile.completedTasks}
          </div>
        </div>

        <div className="bg-[#FF89BB] border-[2px] sm:border-[4px] border-black p-4 sm:p-6 shadow-[3px_3px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[4px_4px_0px_0px_#000] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 stroke-[3px]" />
            <span className="text-xs font-black uppercase tracking-widest">Streak</span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter">
            {userProfile.streak} <span className="text-xl">DAYS</span>
          </div>
        </div>

        <div className="bg-white border-[2px] sm:border-[4px] border-black p-4 sm:p-6 shadow-[3px_3px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[4px_4px_0px_0px_#000] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 stroke-[3px]" />
            <span className="text-xs font-black uppercase tracking-widest">Best</span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter">
            {userProfile.longestStreak} <span className="text-xl">DAYS</span>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div id="tour-xp-chart" className="bg-white border-[2px] sm:border-[4px] border-black p-4 sm:p-6 shadow-[3px_3px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000]">
        <h3 className="font-black text-xl uppercase tracking-tighter mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 stroke-[3px]" />
          Weekly Output
        </h3>
        <WeeklyChart data={weeklyProgress} />
      </div>

      {/* Badges */}
      <div className="bg-[#00E5BC] border-[2px] sm:border-[4px] border-black p-4 sm:p-6 lg:p-8 shadow-[3px_3px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] relative mt-8 sm:mt-12">
        <div className="absolute -top-6 left-6 bg-white border-[4px] border-black px-6 py-2 shadow-[4px_4px_0px_0px_#000] transform -rotate-2">
          <h3 className="font-black text-xl md:text-2xl uppercase tracking-tighter flex items-center gap-3">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3px]" />
            Trophy Room
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8">
          {userProfile.badges && userProfile.badges.length > 0 ? (
            userProfile.badges.map((badge) => (
              <div 
                key={badge.id}
                className="bg-white border-[4px] border-black p-4 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all group relative"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-[4px] border-black flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_#000] group-hover:scale-110 transition-transform p-1">
                  {badge.name.toLowerCase() === '3-day streak' ? (
                    <img src="/badges/streak_3.png" alt={badge.name} className="w-full h-full object-contain drop-shadow-md" />
                  ) : badge.name.toLowerCase() === '7-day streak' ? (
                    <img src="/badges/streak_7.png" alt={badge.name} className="w-full h-full object-contain drop-shadow-md" />
                  ) : badge.name.toLowerCase() === '50 hours focus' ? (
                    <img src="/badges/focus_50.png" alt={badge.name} className="w-full h-full object-contain drop-shadow-md" />
                  ) : badge.name.toLowerCase() === 'early bird' ? (
                    <img src="/badges/early_bird.png" alt={badge.name} className="w-full h-full object-contain drop-shadow-md" />
                  ) : badge.imageUrl ? (
                    <img src={badge.imageUrl} alt={badge.name} className="w-full h-full object-contain drop-shadow-md" />
                  ) : (
                    <span className="text-3xl sm:text-4xl">{badge.icon}</span>
                  )}
                </div>
                <div className="font-black uppercase tracking-tighter text-sm sm:text-base leading-none mb-2">{badge.name}</div>
                <div className="text-[10px] sm:text-xs font-bold uppercase text-black/60 tracking-widest leading-tight">
                  {badge.description}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border-[4px] border-black p-4 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_#000] transition-all group relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFDE00] border-[4px] border-black rounded-full flex items-center justify-center mb-4 shadow-inner group-hover:rotate-12 transition-transform">
                  <span className="text-3xl sm:text-4xl">🌟</span>
                </div>
                <div className="font-black uppercase tracking-tighter text-sm sm:text-base leading-none mb-2">First Step</div>
                <div className="text-[10px] sm:text-xs font-bold uppercase text-black/60 tracking-widest leading-tight">
                  Complete your first task
                </div>
            </div>
          )}
          
          {/* Locked badges placeholder */}
          {(!userProfile.badges || !userProfile.badges.some(b => b.name === '3-Day Streak')) && (
            <div className="bg-white/50 border-[4px] border-dashed border-black p-4 flex flex-col items-center justify-center text-center opacity-70 filter grayscale">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#e0e0e0] border-[4px] border-black rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl sm:text-4xl">🔒</span>
              </div>
              <div className="font-black uppercase tracking-tighter text-sm sm:text-base leading-none mb-2">3-Day Streak</div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-tight">
                Maintain a 3-day streak
              </div>
            </div>
          )}
          {(!userProfile.badges || !userProfile.badges.some(b => b.name === '7-Day Streak')) && (
            <div className="bg-white/50 border-[4px] border-dashed border-black p-4 flex flex-col items-center justify-center text-center opacity-70 filter grayscale">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#e0e0e0] border-[4px] border-black rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl sm:text-4xl">🔒</span>
              </div>
              <div className="font-black uppercase tracking-tighter text-sm sm:text-base leading-none mb-2">7-Day Streak</div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-tight">
                Maintain a 7-day streak
              </div>
            </div>
          )}
          {(!userProfile.badges || !userProfile.badges.some(b => b.name === '50 Hours Focus')) && (
            <div className="bg-white/50 border-[4px] border-dashed border-black p-4 flex flex-col items-center justify-center text-center opacity-70 filter grayscale">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#e0e0e0] border-[4px] border-black rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl sm:text-4xl">🔒</span>
              </div>
              <div className="font-black uppercase tracking-tighter text-sm sm:text-base leading-none mb-2">50 Hours Focus</div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-tight">
                Focus for 50 hours total
              </div>
            </div>
          )}
          {(!userProfile.badges || !userProfile.badges.some(b => b.name === 'Early Bird')) && (
            <div className="bg-white/50 border-[4px] border-dashed border-black p-4 flex flex-col items-center justify-center text-center opacity-70 filter grayscale">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#e0e0e0] border-[4px] border-black rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl sm:text-4xl">🔒</span>
              </div>
              <div className="font-black uppercase tracking-tighter text-sm sm:text-base leading-none mb-2">Early Bird</div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-tight">
                Complete a task before 8 AM
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
