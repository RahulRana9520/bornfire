import React from 'react';
import { Calendar, Target, Clock, Sparkles } from 'lucide-react';
import { AddTaskForm } from '@/components/tasks/AddTaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { WeeklyChart } from '@/components/progress/WeeklyChart';
import { useTaskContext } from '@/contexts/TaskContext';
import { formatTimeDisplay } from '@/lib/taskUtils';

const Index = () => {
  const { getTodayTasks, getTodayProgress, getWeeklyProgress, userProfile } = useTaskContext();
  const todayTasks = getTodayTasks();
  const todayProgress = getTodayProgress();
  const weeklyProgress = getWeeklyProgress();
  
  // Calculate today's focus time
  const todayFocusTime = todayTasks.reduce((sum, task) => sum + task.timeSpent, 0);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2.5 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            Today
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Streak badge */}
        {userProfile.streak > 0 && (
          <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-warning-light to-warning-light/70 rounded-full shadow-md hover:shadow-lg transition-all hover-lift">
            <span className="text-lg sm:text-xl">🔥</span>
            <span className="font-bold text-warning-foreground text-xs sm:text-sm whitespace-nowrap">
              {userProfile.streak} day streak
            </span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
          variant={todayTasks.filter(t => t.completed).length === todayTasks.length && todayTasks.length > 0 ? 'success' : 'primary'}
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

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {/* Task list - takes 2 columns */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-border/50 shadow-md hover:shadow-lg transition-shadow">
            <AddTaskForm />
          </div>
          
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-border/50 shadow-md hover:shadow-lg transition-shadow">
            <TaskList 
              tasks={todayTasks} 
              isEditable={true}
              dateLabel="Today's Tasks"
            />
          </div>
        </div>

        {/* Sidebar - weekly progress */}
        <div className="space-y-5">
          <WeeklyChart data={weeklyProgress} />
          
          {/* Quick tips */}
          <div className="bg-gradient-to-br from-accent to-accent/70 rounded-2xl p-5 border border-border/50 shadow-soft hover:shadow-md-enhanced transition-all hover-lift">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1.5">Pro tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Focus for 25 minutes, then take a 5-minute break. This Pomodoro technique can boost your productivity!
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
