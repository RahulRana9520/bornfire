import React from 'react';
import { Calendar, Target, Clock, Sparkles } from 'lucide-react';
import { AddTaskForm } from '@/components/tasks/AddTaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { WeeklyChart } from '@/components/progress/WeeklyChart';
import { useTaskContext } from '@/contexts/TaskContext';
import { formatTimeDisplay } from '@/lib/taskUtils';
import { useCombinedProgress } from '@/hooks/useCombinedProgress';

const Index = () => {
  const { getTodayTasks, userProfile } = useTaskContext();
  const { todayProgress, weeklyProgress } = useCombinedProgress();
  const todayTasks = getTodayTasks();
  
  // Calculate today's focus time
  const todayFocusTime = todayTasks.reduce((sum, task) => sum + task.timeSpent, 0);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in pb-4">
      {/* Header — mobile: compact stacked, desktop: side-by-side */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 p-4 sm:p-6 border-[2px] sm:border-[3px] border-black bg-white shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-[#FFDE00] border-[2px] sm:border-[3px] border-black p-1.5 sm:p-2 shadow-[2px_2px_0px_0px_#000]">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-black stroke-[3px]" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-black">
              Schedule
            </h1>
          </div>
          <p className="text-black font-black uppercase text-[10px] sm:text-xs tracking-widest mt-1 sm:mt-2">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        
        {/* Streak sticker */}
        {userProfile.streak > 0 && (
          <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border-[2px] sm:border-[3px] border-black bg-[#00E5BC] shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] self-start sm:self-auto">
            <span className="text-xl sm:text-2xl">🔥</span>
            <span className="font-black text-black uppercase tracking-tighter text-xs sm:text-sm">
              {userProfile.streak} DAY STREAK
            </span>
          </div>
        )}
      </div>

      {/* Stats Row — 2x2 grid on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <ProgressCard
          title="Today's Progress"
          value={todayProgress}
          variant={todayProgress === 100 ? 'success' : 'primary'}
          icon="📊"
        />
        <ProgressCard
          title="Focus Time"
          value={Math.round(todayFocusTime / 60)}
          max={480}
          unit="m"
          variant="primary"
          icon="⏱️"
        />
        <ProgressCard
          title="Completed"
          value={todayTasks.filter(t => t.completed).length}
          max={todayTasks.length || 1}
          unit=""
          variant="primary"
          icon="✅"
          showPercentage={false}
        />
        <ProgressCard
          title="XP Today"
          value={Math.round(todayFocusTime / 36)}
          unit=" XP"
          max={1000}
          variant="gold"
          icon="⭐"
        />
      </div>

      {/* Main content grid — single column on mobile, 3-col on desktop */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Task list - takes 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div id="tour-add-task" className="bg-white border-[2px] sm:border-[3px] border-black p-4 sm:p-6 shadow-[3px_3px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000]">
            <AddTaskForm />
          </div>
          
          <div className="bg-white border-[2px] sm:border-[3px] border-black p-4 sm:p-6 shadow-[3px_3px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000]">
            <TaskList 
              tasks={todayTasks} 
              isEditable={true}
              dateLabel="ACTIVE SESSIONS"
            />
          </div>
        </div>

        {/* Sidebar column — weekly progress + tips */}
        <div className="space-y-4 sm:space-y-6">
          <div id="tour-consistency" className="bg-white border-[2px] sm:border-[3px] border-black p-4 sm:p-6 shadow-[3px_3px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000]">
             <WeeklyChart data={weeklyProgress} />
          </div>
          
          {/* Quick tips sticker */}
          <div className="bg-[#FF89BB] border-[2px] sm:border-[3px] border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] relative overflow-hidden group">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-[2px] sm:border-[3px] border-black bg-white flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000]">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[3px]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-xs sm:text-sm uppercase mb-1 sm:mb-2 tracking-tighter">System Intelligence</h4>
                <p className="text-[10px] sm:text-xs font-medium leading-relaxed uppercase">
                  FOCUS FOR 25 MINUTES, THEN TAKE A 5-MINUTE BREAK. THIS POMODORO TECHNIQUE CAN BOOST YOUR PRODUCTIVITY!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
