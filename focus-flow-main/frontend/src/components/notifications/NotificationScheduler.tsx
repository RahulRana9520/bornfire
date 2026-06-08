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

      const todayTasks = tasks.filter(t => {
        if (!t?.createdAt) return false;
        try {
          const taskDate = new Date(t.createdAt).toDateString();
          return taskDate === now.toDateString() && !t.completed;
        } catch (e) {
          return false;
        }
      });

      // 1. EVERY 4 HOURS CHECK (e.g. 8, 12, 16, 20...)
      // Check for pending daily tasks and week goals (habits)
      if (hour % 4 === 0) {
        const incompleteHabits = habits.filter(h => !isHabitCompleted(h.id, now));
        const totalPending = todayTasks.length + incompleteHabits.length;

        if (totalPending > 0) {
          const title = hour < 12 ? 'MORNING AUDIT 🛡️' : hour < 18 ? 'MID-DAY AUDIT 📊' : 'EVENING PUSH ⚡';
          sendNotification(title, {
            body: `Bornfire: You have ${totalPending} pending tasks & goals. Maintain momentum!`,
            tag: '4-hour-reminder',
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
