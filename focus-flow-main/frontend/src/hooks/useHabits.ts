import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Habit, HabitCompletion, WeekData } from '@/types/task';
import { generateId } from '@/lib/taskUtils';

const initialHabits: Habit[] = [];

const initialCompletions: HabitCompletion[] = [];

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('tasksage_habits', initialHabits);
  const [completions, setCompletions] = useLocalStorage<HabitCompletion[]>('tasksage_habit_completions', initialCompletions);

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

  const getWeeksData = useCallback((weeksCount: number = 1): WeekData[] => {
    const weeks: WeekData[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get Monday of current week
    const currentWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days
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
    
    weeks.push({
      weekNumber: 1,
      startDate: currentWeekStart,
      endDate: weekEnd,
      days,
    });
    
    return weeks;
  }, []);

  return {
    habits,
    completions,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompleted,
    getWeeksData,
  };
}
