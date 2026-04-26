import { useEffect, useRef } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useHabitsContext } from '@/contexts/HabitsContext';
import { Task, Habit } from '@/types/task';

export const NotificationScheduler = () => {
  const { tasks } = useTaskContext() as { tasks: Task[] };
  const { habits, isHabitCompleted } = useHabitsContext() as { habits: Habit[], isHabitCompleted: (id: string, date: Date) => boolean };
  const { sendNotification, permission } = useNotifications();
  const lastCheck = useRef<string | null>(null);

  useEffect(() => {
    if (permission !== 'granted') return;

    const checkNotifications = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay(); // 0 is Sunday, 6 is Saturday
      const timeKey = `${now.toDateString()}-${hour}`;

      // Prevent multiple notifications in the same hour
      if (lastCheck.current === timeKey) return;

      // 1. DAILY REMINDERS (3 times a day)
      // Check for tasks created today that are NOT completed
      const todayTasks = tasks.filter(t => {
        if (!t?.createdAt) return false;
        try {
          const taskDate = new Date(t.createdAt).toDateString();
          return taskDate === now.toDateString() && !t.completed;
        } catch (e) {
          return false;
        }
      });

      if (todayTasks.length > 0) {
        // Morning (9 AM)
        if (hour === 9) {
          sendNotification('MISSION START 🛡️', {
            body: `FocusFlow: You have ${todayTasks.length} missions for today. Initialize focus.`,
            tag: 'daily-reminder'
          });
          lastCheck.current = timeKey;
        }
        // Afternoon (2 PM)
        if (hour === 14) {
          sendNotification('MID-DAY AUDIT 📊', {
            body: `${todayTasks.length} tasks remain in your queue. Mantain momentum.`,
            tag: 'daily-reminder'
          });
          lastCheck.current = timeKey;
        }
        // Evening (7 PM)
        if (hour === 19) {
          sendNotification('FINAL PUSH ⚡', {
            body: `Last chance to close those ${todayTasks.length} missions. Finish strong!`,
            tag: 'daily-reminder'
          });
          lastCheck.current = timeKey;
        }
      }

      // 2. WEEKEND ANALYSIS (Saturday/Sunday)
      const isWeekend = day === 0 || day === 6;
      if (isWeekend && habits.length > 0) {
        const incompleteHabits = habits.filter(h => !isHabitCompleted(h.id, now));
        
        // 11 AM "Slump" Check
        if (incompleteHabits.length > 0 && hour === 11) {
           sendNotification('WEEKEND AUDIT ⚠️', {
             body: `Weekend Plan Check: You have ${incompleteHabits.length} habits not yet logged. Don't waste your weekend!`,
             tag: 'weekend-reminder',
             vibrate: [200, 100, 200]
           } as any);
           lastCheck.current = timeKey;
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkNotifications, 60000);
    checkNotifications(); // Initial check

    return () => clearInterval(interval);
  }, [tasks, habits, isHabitCompleted, permission, sendNotification]);

  return null;
};
