export interface Task {
  id: string;
  title: string;
  completed: boolean;
  timeSpent: number; // in seconds
  estimatedTime?: number; // in seconds - target duration
  remainingTime?: number; // in seconds - countdown timer
  isTimerRunning: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  xpReward: number;
}

export interface DayTasks {
  date: Date;
  tasks: Task[];
  isToday: boolean;
  isPast: boolean;
}

export type League = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface UserProfile {
  id: string;
  username: string;
  uniqueId?: string;
  avatar?: string;
  xp: number;
  level: number;
  league: League;
  streak: number;
  longestStreak: number;
  totalFocusTime: number; // in seconds
  completedTasks: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  progress?: number;
  target?: number;
  imageUrl?: string;
}

export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  league: League;
  xp: number;
  isOnline: boolean;
  isWorking: boolean;
  dailyProgress: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  xp: number;
  league: League;
  isCurrentUser?: boolean;
}

// Daily Habits types
export interface Habit {
  id: string;
  title: string;
  createdAt: Date;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  xpGranted?: boolean;
}

export interface WeekData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  days: Date[];
}
