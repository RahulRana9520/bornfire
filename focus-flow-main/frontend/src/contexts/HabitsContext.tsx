import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Habit, HabitCompletion, WeekData } from '@/types/task';
import { generateId } from '@/lib/taskUtils';

interface HabitsContextType {
  habits: Habit[];
  completions: HabitCompletion[];
  addHabit: (title: string) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabitCompletion: (habitId: string, date: Date) => void;
  isHabitCompleted: (habitId: string, date: Date) => boolean;
  markXpGranted: (habitId: string, date: Date) => void;
  hasXpBeenGranted: (habitId: string, date: Date) => boolean;
  getWeeksData: (weeksCount?: number) => WeekData[];
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

const initialHabits: Habit[] = [
  { id: 'h1', title: 'Wake up at 6AM', createdAt: new Date() },
  { id: 'h2', title: 'Exercise', createdAt: new Date() },
  { id: 'h3', title: 'Read for 30 mins', createdAt: new Date() },
];

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('tasksage_habits', initialHabits);
  const [completions, setCompletions] = useLocalStorage<HabitCompletion[]>('tasksage_habit_completions', []);

  const addHabit = useCallback((title: string) => {
    const newHabit: Habit = {
      id: generateId(),
      title,
      createdAt: new Date(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, [setHabits]);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCompletions(prev => prev.filter(c => c.habitId !== habitId));
  }, [setHabits, setCompletions]);

  const toggleHabitCompletion = useCallback((habitId: string, date: Date) => {
    const dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    setCompletions(prev => {
      const existing = prev.find(c => c.habitId === habitId && c.date === dateStr);
      if (existing) {
        return prev.map(c => 
          c.habitId === habitId && c.date === dateStr 
            ? { ...c, completed: !c.completed }
            : c
        );
      }
      return [...prev, { habitId, date: dateStr, completed: true }];
    });
  }, [setCompletions]);

  const isHabitCompleted = useCallback((habitId: string, date: Date): boolean => {
    const dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const completion = completions.find(c => c.habitId === habitId && c.date === dateStr);
    return completion?.completed ?? false;
  }, [completions]);

  const markXpGranted = useCallback((habitId: string, date: Date) => {
    const dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    setCompletions(prev => {
      const existing = prev.find(c => c.habitId === habitId && c.date === dateStr);
      if (existing) {
        return prev.map(c => 
          c.habitId === habitId && c.date === dateStr 
            ? { ...c, xpGranted: true }
            : c
        );
      }
      return [...prev, { habitId, date: dateStr, completed: false, xpGranted: true }];
    });
  }, [setCompletions]);

  const hasXpBeenGranted = useCallback((habitId: string, date: Date): boolean => {
    const dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const completion = completions.find(c => c.habitId === habitId && c.date === dateStr);
    return completion?.xpGranted ?? false;
  }, [completions]);

  const getWeeksData = useCallback((weeksCount: number = 1): WeekData[] => {
    const weeks: WeekData[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get Monday of current week
    const currentWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    currentWeekStart.setDate(today.getDate() - daysFromMonday);
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);
    
    const days: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + d);
      days.push(day);
    }
    
    weeks.push({ weekNumber: 1, startDate: currentWeekStart, endDate: weekEnd, days });
    return weeks;
  }, []);

  const value = useMemo(() => ({
    habits,
    completions,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompleted,
    markXpGranted,
    hasXpBeenGranted,
    getWeeksData
  }), [habits, completions, addHabit, deleteHabit, toggleHabitCompletion, isHabitCompleted, markXpGranted, hasXpBeenGranted, getWeeksData]);

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
};

export const useHabitsContext = () => {
  const context = useContext(HabitsContext);
  if (!context) throw new Error('useHabitsContext must be used within a HabitsProvider');
  return context;
};
