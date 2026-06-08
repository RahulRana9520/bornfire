import { useTaskContext } from '@/contexts/TaskContext';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { isToday } from '@/lib/taskUtils';

export const useCombinedProgress = () => {
  const { tasks } = useTaskContext();
  const { habits, isHabitCompleted } = useHabitsContext();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // calculate today
  const todayTasks = tasks.filter(t => isToday(new Date(t.createdAt)));
  const completedHabitsToday = habits.filter(h => isHabitCompleted(h.id, today)).length;
  const completedTasksToday = todayTasks.filter(t => t.completed).length;
  const totalTodayItems = todayTasks.length + habits.length;
  const todayProgress = totalTodayItems === 0 ? 0 : Math.round(((completedTasksToday + completedHabitsToday) / totalTodayItems) * 100);

  // calculate weekly
  const weeklyProgress: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    // Tasks for this day
    const dayTasks = tasks.filter(task => 
      new Date(task.createdAt).toDateString() === date.toDateString()
    );
    const completedDayTasks = dayTasks.filter(t => t.completed).length;
    
    // Habits for this day
    const completedDayHabits = habits.filter(h => isHabitCompleted(h.id, date)).length;
    
    const totalDayItems = dayTasks.length + habits.length;
    if (totalDayItems === 0) {
      weeklyProgress.push(0);
    } else {
      weeklyProgress.push(Math.round(((completedDayTasks + completedDayHabits) / totalDayItems) * 100));
    }
  }

  return { todayProgress, weeklyProgress };
};
