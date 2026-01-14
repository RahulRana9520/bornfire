import React, { useState } from 'react';
import { Target, Plus, Trash2, Check } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WeekGoals = () => {
  const { habits, addHabit, deleteHabit, toggleHabitCompletion, isHabitCompleted, getWeeksData } = useHabits();
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            <Target className="w-8 h-8 text-primary" />
            Daily Habits
          </h1>
          <p className="text-muted-foreground text-base">
            Track your daily habits across weeks
          </p>
        </div>
        
        {!isAddingHabit && (
          <Button onClick={() => setIsAddingHabit(true)} className="shadow-sm hover:shadow-md transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
        )}
      </div>

      {/* Add Habit Form */}
      {isAddingHabit && (
        <form onSubmit={handleAddHabit} className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft animate-slide-down">
          <div className="flex gap-3">
            <Input
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="Enter habit name (e.g., Wake up at 6AM)"
              className="flex-1 h-12"
              autoFocus
            />
            <Button type="submit" disabled={!newHabitTitle.trim()} className="shadow-sm">
              Add
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsAddingHabit(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Habits Table */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-soft hover:shadow-md-enhanced transition-shadow overflow-hidden">
        {habits.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No habits yet</p>
            <p className="text-xs mt-1">Add a habit to start tracking</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Current Week */}
            <div className="border-b border-border/50">
              {/* Week Header */}
              <div className="bg-accent/50 px-4 py-3 border-b border-border/50">
                <h3 className="font-semibold text-sm">
                  Current Week
                  <span className="text-muted-foreground font-normal ml-2">
                    ({currentWeek.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {currentWeek.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                  </span>
                </h3>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-[1fr_repeat(7,48px)_40px] sm:grid-cols-[1fr_repeat(7,56px)_48px] gap-1 px-4 py-2 bg-muted/30 border-b border-border/30">
                <div className="text-xs font-medium text-muted-foreground">Habit</div>
                {currentWeek.days.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={cn(
                      "text-xs font-medium text-center",
                      isToday(day) ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <div>{dayLabels[dayIndex]}</div>
                    <div className={cn(
                      "text-[10px]",
                      isToday(day) && "font-bold"
                    )}>
                      {day.getDate()}
                    </div>
                  </div>
                ))}
                <div></div>
              </div>

              {/* Habit Rows */}
              {habits.map((habit) => (
                <div 
                  key={habit.id}
                  className="grid grid-cols-[1fr_repeat(7,48px)_40px] sm:grid-cols-[1fr_repeat(7,56px)_48px] gap-1 px-4 py-3 border-b border-border/30 last:border-b-0 hover:bg-accent/30 transition-colors group"
                >
                  <div className="text-sm font-medium truncate pr-2">{habit.title}</div>
                  {currentWeek.days.map((day, dayIndex) => {
                    const completed = isHabitCompleted(habit.id, day);
                    const isTodayDate = isToday(day);
                    const isPastDate = isPast(day);
                    const isFutureDate = isFuture(day);
                    const canToggle = isTodayDate || isPastDate; // Can only toggle today or past

                    return (
                      <div key={dayIndex} className="flex items-center justify-center">
                        <button
                          onClick={() => canToggle && toggleHabitCompletion(habit.id, day)}
                          disabled={!canToggle}
                          className={cn(
                            "w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 flex items-center justify-center transition-all",
                            completed 
                              ? "bg-success border-success text-success-foreground shadow-sm hover:scale-110" 
                              : "border-border",
                            isTodayDate && !completed && "border-primary/50 bg-primary/5 ring-2 ring-primary/20 hover:border-primary hover:bg-primary/10 hover:scale-110",
                            isPastDate && !completed && "hover:border-primary/50 hover:bg-primary/5 hover:scale-110",
                            isFutureDate && "opacity-40 cursor-not-allowed hover:scale-100 bg-muted/30",
                            canToggle && !completed && "cursor-pointer"
                          )}
                          title={isFutureDate ? "Future days cannot be checked" : canToggle ? "Toggle completion" : ""}
                        >
                          {completed && <Check className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
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
