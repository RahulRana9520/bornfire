import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { PlacementPlanData, PlacementProfile, DailyPlacementPlan, PlacementTask } from '@/types/placement';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateRoadmapAI } from '@/lib/placementAI';
import { useTaskContext } from './TaskContext';

interface PlacementContextType {
  planData: PlacementPlanData | null;
  isGenerating: boolean;
  generatePlan: (profile: PlacementProfile) => Promise<void>;
  clearPlan: () => void;
  toggleTaskComplete: (dayNumber: number, taskId: string) => void;
  getCurrentDayPlan: () => DailyPlacementPlan | null;
  getCompletionPercentage: () => number;
}

const PlacementContext = createContext<PlacementContextType | undefined>(undefined);

export function PlacementProvider({ children }: { children: React.ReactNode }) {
  const [planData, setPlanData] = useLocalStorage<PlacementPlanData | null>('bornfire_placement_plan', null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { addXP, updateStreak } = useTaskContext();

  const generatePlan = async (profile: PlacementProfile) => {
    setIsGenerating(true);
    try {
      const roadmap = await generateRoadmapAI(profile);
      setPlanData({ profile, roadmap });
    } catch (err) {
      console.error("Failed to generate plan", err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearPlan = () => setPlanData(null);

  const toggleTaskComplete = useCallback((dayNumber: number, taskId: string) => {
    setPlanData(prev => {
      if (!prev) return prev;
      
      const newRoadmap = prev.roadmap.map(day => {
        if (day.dayNumber === dayNumber) {
          const newTasks = day.tasks.map(t => {
            if (t.id === taskId) {
              const newCompleted = !t.completed;
              // Award XP on completion
              if (newCompleted) {
                addXP(t.xpReward || 30);
                if (updateStreak) updateStreak();
              }
              return { ...t, completed: newCompleted };
            }
            return t;
          });
          return { ...day, tasks: newTasks };
        }
        return day;
      });

      return { ...prev, roadmap: newRoadmap };
    });
  }, [setPlanData, addXP, updateStreak]);

  const getCurrentDayPlan = useCallback(() => {
    if (!planData) return null;
    
    // Calculate days diff between start date and today
    const startDate = new Date(planData.profile.startDate);
    startDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    let currentDayNumber = diffDays + 1; // if today == startDate, day is 1
    if (today < startDate) {
      currentDayNumber = 1; // hasn't started yet, default to day 1
    }
    if (currentDayNumber > planData.profile.daysAvailable) {
      currentDayNumber = planData.profile.daysAvailable;
    }

    const todayPlan = planData.roadmap.find(d => d.dayNumber === currentDayNumber);
    if (!todayPlan) return null;

    // Optional: Auto carry-forward logic here. (Simplistic: just fetch incomplete past tasks)
    const carryForwardTasks: PlacementTask[] = [];
    planData.roadmap.forEach(d => {
      if (d.dayNumber < currentDayNumber) {
        d.tasks.forEach(t => {
          if (!t.completed) {
            carryForwardTasks.push({ ...t, isCarryForward: true });
          }
        });
      }
    });

    return {
      ...todayPlan,
      tasks: [...carryForwardTasks, ...todayPlan.tasks]
    };
  }, [planData]);

  const getCompletionPercentage = useCallback(() => {
    if (!planData) return 0;
    let total = 0;
    let completed = 0;
    planData.roadmap.forEach(d => {
      d.tasks.forEach(t => {
        total++;
        if (t.completed) completed++;
      });
    });
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }, [planData]);

  const value = useMemo(() => ({
    planData,
    isGenerating,
    generatePlan,
    clearPlan,
    toggleTaskComplete,
    getCurrentDayPlan,
    getCompletionPercentage
  }), [planData, isGenerating, toggleTaskComplete, getCurrentDayPlan, getCompletionPercentage]);

  return (
    <PlacementContext.Provider value={value}>
      {children}
    </PlacementContext.Provider>
  );
}

export function usePlacementContext() {
  const context = useContext(PlacementContext);
  if (context === undefined) {
    throw new Error('usePlacementContext must be used within a PlacementProvider');
  }
  return context;
}
