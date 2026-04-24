import React, { createContext, useContext, useCallback, useEffect, useMemo } from 'react';
import { Task, UserProfile, DayTasks, Friend, Badge, LeaderboardEntry } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId, isToday, isPast, getTaskCompletionXP, calculateLevel } from '@/lib/taskUtils';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  userProfile: UserProfile;
  friends: Friend[];
  leaderboard: LeaderboardEntry[];
  addTask: (title: string, priority?: Task['priority'], estimatedTime?: number) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  startTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
  updateTaskTime: (taskId: string, time: number) => void;
  updateStreak?: () => void;
  getDayTasks: () => DayTasks[];
  getTodayTasks: () => Task[];
  getTodayProgress: () => number;
  getWeeklyProgress: () => number[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Initial mock data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Math Assignment',
    completed: false,
    timeSpent: 1800,
    estimatedTime: 3600,
    remainingTime: 3600,
    isTimerRunning: false,
    createdAt: new Date(),
    priority: 'high',
    xpReward: 50,
  },
  {
    id: '2',
    title: 'Read Chapter 5 - Biology',
    completed: false,
    timeSpent: 0,
    estimatedTime: 1800,
    remainingTime: 1800,
    isTimerRunning: false,
    createdAt: new Date(),
    priority: 'medium',
    xpReward: 30,
  },
  {
    id: '3',
    title: 'Practice Programming Problems',
    completed: true,
    timeSpent: 3600,
    estimatedTime: 3600,
    remainingTime: 0,
    isTimerRunning: false,
    createdAt: new Date(),
    priority: 'high',
    xpReward: 60,
  },
];

const initialProfile: UserProfile = {
  id: 'user1',
  username: 'StudyMaster',
  uniqueId: '#FF-GUEST1',
  xp: 1250,
  level: 4,
  league: 'silver',
  streak: 7,
  longestStreak: 14,
  totalFocusTime: 0,
  completedTasks: 0,
  badges: [
    { id: 'b1', name: '3-Day Streak', description: 'Complete tasks 3 days in a row', icon: '🔥', earnedAt: new Date() },
    { id: 'b2', name: '7-Day Streak', description: 'Complete tasks 7 days in a row', icon: '⚡', earnedAt: new Date() },
    { id: 'b3', name: 'Early Bird', description: 'Complete a task before 8 AM', icon: '🌅', earnedAt: new Date() },
  ],
};

const initialFriends: Friend[] = [
  { id: 'f1', username: 'CodeNinja', league: 'gold', xp: 2500, isOnline: true, isWorking: true, dailyProgress: 75 },
  { id: 'f2', username: 'MathWhiz', league: 'silver', xp: 1800, isOnline: true, isWorking: false, dailyProgress: 45 },
  { id: 'f3', username: 'ScienceGeek', league: 'bronze', xp: 800, isOnline: false, isWorking: false, dailyProgress: 20 },
  { id: 'f4', username: 'LitLover', league: 'silver', xp: 1600, isOnline: true, isWorking: true, dailyProgress: 60 },
];

const initialLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'l1', username: 'TopStudent', xp: 5200, league: 'diamond' },
  { rank: 2, userId: 'l2', username: 'CodeNinja', xp: 2500, league: 'gold' },
  { rank: 3, userId: 'l3', username: 'MathWhiz', xp: 1800, league: 'silver' },
  { rank: 4, userId: 'user1', username: 'StudyMaster', xp: 1250, league: 'silver', isCurrentUser: true },
  { rank: 5, userId: 'l5', username: 'ScienceGeek', xp: 800, league: 'bronze' },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasksage_tasks', initialTasks);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('tasksage_profile', initialProfile);
  const [friends] = useLocalStorage<Friend[]>('tasksage_friends', initialFriends);
  const [leaderboard] = useLocalStorage<LeaderboardEntry[]>('tasksage_leaderboard', initialLeaderboard);
  const { user } = useAuth();

  // Sync profile with Supabase if logged in
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id);

      console.log('Checking profile for:', user.id);
      
      let profileData = data && data.length > 0 ? data[0] : null;

      // If profile is totally missing from DB, create it now!
      if (!profileData) {
        console.log('Profile missing from DB. Creating auto-profile...');
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let newId = '#FF-';
        for (let i = 0; i < 6; i++) {
          newId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const newProfile = {
          id: user.id,
          email: user.email,
          username: user.email?.split('@')[0] || 'User',
          unique_id: newId,
          xp: 0,
          level: 1,
          league: 'bronze',
          streak: 0,
          longest_streak: 0,
        };

        console.log('Attempting to insert:', newProfile);
        const { error: createError } = await supabase.from('users').insert([newProfile]);
        if (createError) {
          console.error('FAILED TO AUTO-CREATE PROFILE:', createError.message);
          console.error('TIP: Run the ALTER TABLE SQL I just gave you to fix this!');
        } else {
          console.log('Auto-profile created successfully!');
          profileData = newProfile;
        }
      }

      if (profileData) {
        console.log('Profile loaded:', profileData);
        setUserProfile(prev => ({
          ...prev,
          username: profileData.username || user.email?.split('@')[0] || 'User',
          uniqueId: profileData.unique_id,
          avatar: profileData.avatar_url,
          xp: profileData.xp || 0,
          level: profileData.level || 1,
          league: profileData.league || 'bronze',
          streak: profileData.streak || 0,
          longestStreak: profileData.longest_streak || 0,
        }));
      } else if (error) {
        console.error('PROFILE LOAD ERROR:', error.message);
      }
    };

    fetchProfile();
  }, [user, setUserProfile]);

  const addTask = useCallback((title: string, priority: Task['priority'] = 'medium', estimatedTime: number = 1800) => {
    const newTask: Task = {
      id: generateId(),
      title,
      completed: false,
      timeSpent: 0,
      estimatedTime,
      remainingTime: estimatedTime,
      isTimerRunning: false,
      createdAt: new Date(),
      priority,
      xpReward: priority === 'high' ? 50 : priority === 'medium' ? 30 : 20,
    };
    setTasks(prev => [...prev, newTask]);
  }, [setTasks]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, [setTasks]);

  const toggleTaskComplete = useCallback((taskId: string) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          if (newCompleted && task.isTimerRunning) {
            return { ...task, completed: true, isTimerRunning: false };
          }
          return { ...task, completed: newCompleted };
        }
        return task;
      });
      return updatedTasks;
    });

    // Update XP when task is completed - only for TODAY's tasks
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed && isToday(new Date(task.createdAt))) {
      const xpGained = getTaskCompletionXP(); // Fixed 20 XP per task
      setUserProfile(prev => ({
        ...prev,
        xp: prev.xp + xpGained,
        level: calculateLevel(prev.xp + xpGained),
      }));
    }
  }, [setTasks, tasks, userProfile.streak, setUserProfile]);

  const startTimer = useCallback((taskId: string) => {
    // Stop any other running timers first
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          isTimerRunning: true,
          remainingTime: task.remainingTime ?? task.estimatedTime ?? 1800,
        };
      }
      return { ...task, isTimerRunning: false };
    }));
  }, [setTasks]);

  const stopTimer = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isTimerRunning: false } : task
    ));
  }, [setTasks]);

  const updateTaskTime = useCallback((taskId: string, time: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, timeSpent: time } : task
    ));
  }, [setTasks]);

  const getDayTasks = useCallback((): DayTasks[] => {
    const tasksByDate = new Map<string, Task[]>();
    
    tasks.forEach(task => {
      const dateKey = new Date(task.createdAt).toDateString();
      if (!tasksByDate.has(dateKey)) {
        tasksByDate.set(dateKey, []);
      }
      tasksByDate.get(dateKey)!.push(task);
    });

    const dayTasks: DayTasks[] = [];
    tasksByDate.forEach((dateTasks, dateKey) => {
      const date = new Date(dateKey);
      dayTasks.push({
        date,
        tasks: dateTasks,
        isToday: isToday(date),
        isPast: isPast(date),
      });
    });

    return dayTasks.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [tasks]);

  const getTodayTasks = useCallback((): Task[] => {
    return tasks.filter(task => isToday(new Date(task.createdAt)));
  }, [tasks]);

  const getTodayProgress = useCallback((): number => {
    const todayTasks = getTodayTasks();
    if (todayTasks.length === 0) return 0;
    const completed = todayTasks.filter(t => t.completed).length;
    return Math.round((completed / todayTasks.length) * 100);
  }, [getTodayTasks]);

  const getWeeklyProgress = useCallback((): number[] => {
    const progress: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTasks = tasks.filter(task => 
        new Date(task.createdAt).toDateString() === date.toDateString()
      );
      if (dayTasks.length === 0) {
        progress.push(0);
      } else {
        const completed = dayTasks.filter(t => t.completed).length;
        progress.push(Math.round((completed / dayTasks.length) * 100));
      }
    }
    return progress;
  }, [tasks]);

  // Update user profile when tasks change - only count TODAY's tasks
  useEffect(() => {
    const todayTasks = tasks.filter(task => isToday(new Date(task.createdAt)));
    const completedTasks = todayTasks.filter(t => t.completed).length;
    const totalFocusTime = todayTasks.filter(t => t.completed).reduce((sum, t) => sum + t.timeSpent, 0);
    
    setUserProfile(prev => ({
      ...prev,
      completedTasks,
      totalFocusTime,
    }));
  }, [tasks, setUserProfile]);

  // Update streak when user checks in
  const updateStreak = useCallback(() => {
    setUserProfile(prev => {
      const newStreak = prev.streak + 1;
      return {
        ...prev,
        streak: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak),
      };
    });
  }, [setUserProfile]);

  // Persist data on window close/reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Force save all data to localStorage
      localStorage.setItem('tasksage_tasks', JSON.stringify(tasks));
      localStorage.setItem('tasksage_profile', JSON.stringify(userProfile));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [tasks, userProfile]);

  const value = useMemo(() => ({
    tasks,
    userProfile,
    friends,
    leaderboard,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    startTimer,
    stopTimer,
    updateTaskTime,
    updateStreak,
    getDayTasks,
    getTodayTasks,
    getTodayProgress,
    getWeeklyProgress,
  }), [
    tasks,
    userProfile,
    friends,
    leaderboard,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    startTimer,
    stopTimer,
    updateTaskTime,
    updateStreak,
    getDayTasks,
    getTodayTasks,
    getTodayProgress,
    getWeeklyProgress,
  ]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
