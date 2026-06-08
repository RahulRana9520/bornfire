import React, { useState } from 'react';
import { Target, Plus, Trash2, Check } from 'lucide-react';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WeekGoals = () => {
  const { habits, addHabit, deleteHabit, toggleHabitCompletion, isHabitCompleted, markXpGranted, hasXpBeenGranted, getWeeksData } = useHabitsContext();
  const { addXP } = useTaskContext();
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  const weeks = getWeeksData(1); // Only current week
  const currentWeek = weeks[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitTitle.trim()) {
      addHabit(newHabitTitle.trim());
      setNewHabitTitle('');
      setIsAddingHabit(false);
    }
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    return date < today;
  };

  const isFuture = (date: Date) => {
    return date > today;
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in pb-10 pt-16 sm:pt-0">
      {/* Header */}
      <div className="bg-[#FFDE00] border-[4px] border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-3">
              <Target className="w-8 h-8 sm:w-10 sm:h-10" />
              Daily Habits
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-70">
              Track your daily habits across weeks
            </p>
          </div>
          
          {!isAddingHabit && (
            <Button 
              onClick={() => setIsAddingHabit(true)} 
              className="bg-black text-white border-[3px] border-black px-6 py-6 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Habit
            </Button>
          )}
        </div>
      </div>

      {/* Add Habit Form */}
      {isAddingHabit && (
        <form onSubmit={handleAddHabit} className="bg-white border-[4px] border-black p-4 lg:p-6 shadow-[6px_6px_0px_0px_#00E5BC] animate-slide-down">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="ENTER HABIT NAME... (E.G. DON'T SLACK)"
              className="flex-1 h-14 bg-white border-[4px] border-black px-6 font-bold text-lg focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={!newHabitTitle.trim()} className="flex-1 sm:flex-none h-14 bg-black text-white border-[4px] border-black px-8 font-black uppercase tracking-widest hover:bg-black/90">
                ADD
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingHabit(false)} className="h-14 bg-white border-[4px] border-black px-6 font-black uppercase tracking-widest hover:bg-black/5">
                X
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Habits Scroll Container */}
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
        {habits.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-white">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-black uppercase tracking-widest">No Active Habits</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            {/* Current Week Container */}
            <div className="min-w-[700px] sm:min-w-full">
              {/* Week Header */}
              <div className="bg-[#00E5BC] px-6 py-4 border-b-[4px] border-black flex items-center justify-between">
                <h3 className="font-black text-sm uppercase italic tracking-widest">
                  Current Week
                  <span className="ml-3 font-bold not-italic opacity-60">
                    [{currentWeek.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {currentWeek.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}]
                  </span>
                </h3>
              </div>

              {/* Day Headers (Sticky Header) */}
              <div className="grid grid-cols-[160px_repeat(7,1fr)_60px] gap-0 border-b-[4px] border-black bg-white">
                <div className="sticky left-0 bg-[#00E5BC] border-r-[4px] border-black z-20 text-[10px] font-black uppercase tracking-widest px-4 py-4">Habit</div>

                {currentWeek.days.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={cn(
                      "text-[10px] font-black text-center uppercase tracking-tighter py-4 border-r-[2px] border-black/10 last:border-r-0 flex flex-col items-center justify-center gap-0.5",
                      isToday(day) ? "bg-[#FFDE00]/30 text-black" : "text-black/60"
                    )}
                  >
                    <div>{dayLabels[dayIndex]}</div>
                    <div className="text-[12px] font-black">{day.getDate()}</div>
                  </div>
                ))}
                <div className="bg-white" />
              </div>

              {/* Habit Rows */}
              {habits.map((habit) => (
                <div 
                  key={habit.id}
                  className="grid grid-cols-[160px_repeat(7,1fr)_60px] gap-0 border-b-[2px] border-black hover:bg-black/[0.02] transition-colors group"
                >
                  <div className="sticky left-0 bg-white group-hover:bg-[#fcfcfc] z-10 text-xs font-black uppercase italic tracking-tighter truncate px-4 py-6 border-r-[4px] border-black flex items-center">
                    {habit.title}
                  </div>
                  {currentWeek.days.map((day, dayIndex) => {
                    const completed = isHabitCompleted(habit.id, day);
                    const isTodayDate = isToday(day);
                    const isPastDate = isPast(day);
                    const isFutureDate = isFuture(day);
                    const canToggle = isTodayDate || isPastDate;

                    return (
                      <div key={dayIndex} className="flex items-center justify-center border-r-[2px] border-black/5 last:border-r-0">
                        <button
                          onClick={() => {
                            if (canToggle) {
                              if (!completed && !hasXpBeenGranted(habit.id, day)) {
                                addXP(15);
                                markXpGranted(habit.id, day);
                              }
                              toggleHabitCompletion(habit.id, day);
                            }
                          }}
                          disabled={!canToggle}
                          className={cn(
                            "w-10 h-10 rounded-none border-[3px] flex items-center justify-center transition-all",
                            completed 
                              ? "bg-black border-black text-white shadow-[3px_3px_0px_0px_#00E5BC]" 
                              : "border-black bg-white",
                            isTodayDate && !completed && "border-[#FFDE00] bg-[#FFDE00]/10 shadow-[3px_3px_0px_0px_#000]",
                            isFutureDate && "opacity-20 cursor-not-allowed",
                            canToggle && !completed && "cursor-pointer hover:bg-black/10"
                          )}
                        >
                          {completed && <Check className="w-5 h-5 stroke-[4px]" />}
                        </button>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-center px-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-20 group-hover:opacity-100 transition-opacity text-black hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Summary */}
      {habits.length > 0 && (
        <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-soft hover:shadow-md-enhanced transition-all hover-lift text-center">
          {(() => {
            const totalPossible = habits.length * 7;
            let completedCount = 0;
            currentWeek.days.forEach(day => {
              habits.forEach(habit => {
                if (isHabitCompleted(habit.id, day)) completedCount++;
              });
            });
            const progress = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0;

            return (
              <>
                <div className="text-sm font-semibold text-muted-foreground mb-3">Week Progress</div>
                <div className="text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">{progress}%</div>
                <div className="text-sm text-muted-foreground font-medium mb-4">{completedCount}/{totalPossible} completed</div>
                <div className="max-w-md mx-auto h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      progress === 100 ? "bg-gradient-to-r from-success to-success/80" : "bg-gradient-to-r from-primary to-primary/80"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default WeekGoals;
