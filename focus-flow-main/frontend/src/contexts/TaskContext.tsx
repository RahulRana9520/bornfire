import React, { createContext, useContext, useCallback, useEffect, useMemo } from 'react';
import { Task, UserProfile, DayTasks, Friend, Badge, LeaderboardEntry } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId, isToday, isPast, getTaskCompletionXP, calculateLevel, getLeagueByLevel } from '@/lib/taskUtils';
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
  addFriendById: (uniqueId: string) => Promise<{ success: boolean; error?: string }>;
  lastCheckIn: string | null;
  setLastCheckIn: (value: string | null | ((prev: string | null) => string | null)) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Initial mock data
// Initial data - NOW EMPTY FOR REALISM
const initialTasks: Task[] = [];

const initialProfile: UserProfile = {
  id: '',
  username: 'New User',
  uniqueId: '#BF-000000',
  xp: 0,
  level: 1,
  league: 'bronze',
  streak: 0,
  longestStreak: 0,
  totalFocusTime: 0,
  completedTasks: 0,
  badges: [],
};

const initialFriends: Friend[] = [];

const initialLeaderboard: LeaderboardEntry[] = [];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasksage_tasks', []);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('tasksage_profile', initialProfile);
  const [friends, setFriends] = useLocalStorage<Friend[]>('tasksage_friends', []);
  const [leaderboard, setLeaderboard] = useLocalStorage<LeaderboardEntry[]>('tasksage_leaderboard', []);
  const [lastCheckIn, setLastCheckIn] = useLocalStorage<string | null>('bornfire_last_checkin', null);
  const [refreshCount, setRefreshCount] = React.useState(0);
  const { user } = useAuth();

  // Sync profile, friends, and leaderboard with Supabase if logged in
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // 1. Fetch Profile
      const { data: profileDataArr } = await supabase.from('users').select('*').eq('id', user.id);
      let profileData = profileDataArr && profileDataArr.length > 0 ? profileDataArr[0] : null;

      if (!profileData) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let newId = '#BF-';
        for (let i = 0; i < 6; i++) newId += chars.charAt(Math.floor(Math.random() * chars.length));
        const newProfile = { id: user.id, email: user.email, username: user.email?.split('@')[0] || 'User', unique_id: newId, xp: 0, level: 1, league: 'bronze', streak: 0, longest_streak: 0 };
        await supabase.from('users').insert([newProfile]);
        profileData = newProfile;
      }

      if (profileData) {
        let syncedStreak = profileData.streak || 0;
        const syncedLongestStreak = profileData.longest_streak || 0;
        const lastCheckinDate = profileData.last_checkin_date; // 'YYYY-MM-DD'

        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const localTodayStr = `${year}-${month}-${day}`;

        const y = new Date();
        y.setDate(y.getDate() - 1);
        const yYear = y.getFullYear();
        const yMonth = String(y.getMonth() + 1).padStart(2, '0');
        const yDay = String(y.getDate()).padStart(2, '0');
        const localYesterdayStr = `${yYear}-${yMonth}-${yDay}`;

        // Check if they broke their streak (last checkin was before yesterday)
        if (lastCheckinDate && lastCheckinDate !== localTodayStr && lastCheckinDate !== localYesterdayStr) {
          syncedStreak = 0; // Reset streak
          await supabase
            .from('users')
            .update({ streak: 0 })
            .eq('id', user.id);
        }

        // Sync local storage checkin status
        if (lastCheckinDate === localTodayStr) {
          setLastCheckIn(new Date().toDateString());
        }

        const localProfileStr = localStorage.getItem('tasksage_profile');
        const localProfile = localProfileStr ? JSON.parse(localProfileStr) : null;
        let finalXP = profileData.xp || 0;
        let finalLevel = profileData.level || 1;
        let finalStreak = syncedStreak;
        let finalLongestStreak = syncedLongestStreak;

        // If local guest progress is higher (e.g. they just logged in/signed up), sync it up to DB!
        if (localProfile && (localProfile.xp > finalXP || localProfile.streak > finalStreak)) {
          finalXP = Math.max(finalXP, localProfile.xp);
          finalLevel = Math.max(finalLevel, localProfile.level);
          finalStreak = Math.max(finalStreak, localProfile.streak);
          finalLongestStreak = Math.max(finalLongestStreak, localProfile.longestStreak);

          await supabase
            .from('users')
            .update({
              xp: finalXP,
              level: finalLevel,
              streak: finalStreak,
              longest_streak: finalLongestStreak,
            })
            .eq('id', user.id);
        }

        setUserProfile(prev => ({
          ...prev,
          username: profileData.username || user.email?.split('@')[0] || 'User',
          uniqueId: profileData.unique_id,
          xp: finalXP,
          level: finalLevel,
          league: getLeagueByLevel(finalLevel),
          streak: finalStreak,
          longestStreak: finalLongestStreak,
        }));
      }

      // 2. Fetch Real Friends (Bulletproof Way)
      const { data: friendsList } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);

      if (friendsList && friendsList.length > 0) {
        const friendIds = friendsList.map(f => f.friend_id);
        
        const { data: friendProfiles, error: fError } = await supabase
          .from('users')
          .select('id, username, league, xp')
          .in('id', friendIds);

        if (friendProfiles) {
          const mappedFriends: Friend[] = friendProfiles.map(u => ({
            id: u.id,
            username: u.username,
            league: getLeagueByLevel(calculateLevel(u.xp)),
            xp: u.xp,
            isOnline: true,
            isWorking: false,
            dailyProgress: 0
          }));
          setFriends(mappedFriends);
        }
      } else {
        setFriends([]); // No friends found
      }

      // 3. Fetch Real Leaderboard
      const { data: leaderboardData } = await supabase
        .from('users')
        .select('id, username, xp, league')
        .order('xp', { ascending: false })
        .limit(10);

      if (leaderboardData) {
        const mappedLeaderboard: LeaderboardEntry[] = leaderboardData.map((u, index) => ({
          rank: index + 1,
          userId: u.id,
          username: u.username,
          xp: u.xp,
          league: getLeagueByLevel(calculateLevel(u.xp)),
          isCurrentUser: u.id === user.id
        }));
        setLeaderboard(mappedLeaderboard);
      }
    };

    fetchData();
  }, [user, setUserProfile, setFriends, setLeaderboard, refreshCount]);

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
      setUserProfile(prev => {
        const nextXP = prev.xp + xpGained;
        const nextLevel = calculateLevel(nextXP);
        const nextLeague = getLeagueByLevel(nextLevel);
        
        if (user) {
          supabase
            .from('users')
            .update({
              xp: nextXP,
              level: nextLevel,
              league: nextLeague,
            })
            .eq('id', user.id)
            .then(({ error }) => {
              if (error) console.error('Error updating XP in Supabase:', error);
              else setRefreshCount(prevRefresh => prevRefresh + 1);
            });
        }

        return {
          ...prev,
          xp: nextXP,
          level: nextLevel,
          league: nextLeague,
        };
      });
    }
  }, [setTasks, tasks, user, setUserProfile]);

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
  // Invite friend by ID
  const addFriendById = useCallback(async (uniqueId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Auth required' };
    
    try {
      // 1. Find user with this ID
      const { data: targetUser, error: findError } = await supabase
        .from('users')
        .select('id, username, league, xp')
        .eq('unique_id', uniqueId)
        .single();

      if (findError || !targetUser) {
        console.error('Add Friend Error (Search):', findError);
        return { success: false, error: 'User not found' };
      }

      if (targetUser.id === user.id) {
        return { success: false, error: 'You cannot add yourself' };
      }

      // 2. Add to friends table (Mutual Handshake)
      // We insert TWO rows: Me -> Friend AND Friend -> Me
      const { error: insertError } = await supabase
        .from('friends')
        .insert([
          {
            user_id: user.id,
            friend_id: targetUser.id,
            status: 'accepted'
          },
          {
            user_id: targetUser.id,
            friend_id: user.id,
            status: 'accepted'
          }
        ]);

      if (insertError) {
        // If one direction exists, maybe the other doesn't, so we ignore conflict errors (23505)
        if (insertError.code !== '23505') return { success: false, error: insertError.message };
      }

      // Success - Trigger re-fetch
      setRefreshCount(prev => prev + 1);
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Unexpected connection error' };
    }
  }, [user]);

  // Update streak when user checks in
  const updateStreak = useCallback(() => {
    setUserProfile(prev => {
      const newStreak = prev.streak + 1;
      const newLongestStreak = Math.max(newStreak, prev.longestStreak);

      if (user) {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const localTodayStr = `${year}-${month}-${day}`;

        supabase
          .from('users')
          .update({
            streak: newStreak,
            longest_streak: newLongestStreak,
            last_checkin_date: localTodayStr,
          })
          .eq('id', user.id)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating streak in Supabase:', error);
            } else {
              console.log('Successfully updated streak in Supabase:', {
                streak: newStreak,
                longest_streak: newLongestStreak,
                last_checkin_date: localTodayStr,
              });
              setRefreshCount(prev => prev + 1);
            }
          });
      }

      return {
        ...prev,
        streak: newStreak,
        longestStreak: newLongestStreak,
      };
    });
  }, [user, setUserProfile]);

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
    addFriendById,
    getDayTasks,
    getTodayTasks,
    getTodayProgress,
    getWeeklyProgress,
    lastCheckIn,
    setLastCheckIn,
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
    addFriendById,
    getDayTasks,
    getTodayTasks,
    getTodayProgress,
    getWeeklyProgress,
    lastCheckIn,
    setLastCheckIn,
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
