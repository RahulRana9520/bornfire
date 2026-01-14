import { Task, DayTasks, LeaderboardEntry, League } from '@/types/task';

// Format time from seconds to HH:MM:SS or MM:SS
export function formatTime(seconds: number, showHours = true): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (showHours && hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format time for display (e.g., "2h 30m")
export function formatTimeDisplay(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs > 0) {
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  return `${mins}m`;
}

// Calculate XP based on focused time (1 hour = 100 XP base)
export function calculateXP(focusedSeconds: number, streakBonus: number = 0): number {
  const baseXP = Math.floor(focusedSeconds / 36); // 100 XP per hour = ~0.028 XP per second
  const bonus = Math.floor(baseXP * (streakBonus / 100));
  return baseXP + bonus;
}

// Get streak bonus percentage
export function getStreakBonus(streak: number): number {
  if (streak >= 30) return 50;
  if (streak >= 14) return 30;
  if (streak >= 7) return 20;
  if (streak >= 3) return 10;
  return 0;
}

// Merge sort for leaderboard (as required by the project spec)
export function mergeSort(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  if (entries.length <= 1) return entries;

  const mid = Math.floor(entries.length / 2);
  const left = mergeSort(entries.slice(0, mid));
  const right = mergeSort(entries.slice(mid));

  return merge(left, right);
}

function merge(left: LeaderboardEntry[], right: LeaderboardEntry[]): LeaderboardEntry[] {
  const result: LeaderboardEntry[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex].xp >= right[rightIndex].xp) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Priority Queue implementation for task sorting
export class PriorityQueue<T> {
  private heap: { item: T; priority: number }[] = [];

  enqueue(item: T, priority: number): void {
    this.heap.push({ item, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop()?.item;

    const result = this.heap[0].item;
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return result;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].priority >= this.heap[index].priority) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let largest = index;

      if (leftChild < this.heap.length && this.heap[leftChild].priority > this.heap[largest].priority) {
        largest = leftChild;
      }
      if (rightChild < this.heap.length && this.heap[rightChild].priority > this.heap[largest].priority) {
        largest = rightChild;
      }

      if (largest === index) break;
      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }

  get length(): number {
    return this.heap.length;
  }
}

// Sort tasks by priority using Priority Queue
export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityMap = { high: 3, medium: 2, low: 1 };
  const pq = new PriorityQueue<Task>();

  tasks.forEach(task => {
    pq.enqueue(task, priorityMap[task.priority]);
  });

  const sorted: Task[] = [];
  while (pq.length > 0) {
    const task = pq.dequeue();
    if (task) sorted.push(task);
  }

  return sorted;
}

// 0/1 Knapsack for selecting optimal tasks for limited hours
export function selectOptimalTasks(tasks: Task[], maxSeconds: number): Task[] {
  const n = tasks.length;
  const dp: number[][] = Array(n + 1).fill(null).map(() => Array(maxSeconds + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const task = tasks[i - 1];
    const estimatedTime = Math.max(1800, 3600); // Assume 30-60 min per task
    for (let w = 0; w <= maxSeconds; w++) {
      if (estimatedTime <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - estimatedTime] + task.xpReward);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected tasks
  const selected: Task[] = [];
  let w = maxSeconds;
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(tasks[i - 1]);
      const estimatedTime = Math.max(1800, 3600);
      w -= estimatedTime;
    }
  }

  return selected;
}

// Get league name with proper formatting
export function getLeagueName(league: League): string {
  return league.charAt(0).toUpperCase() + league.slice(1);
}

// Calculate level from XP
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Calculate XP needed for next level
export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Check if a date is today
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// Check if a date is in the past
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

// Format date for display
export function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isToday(date)) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}
