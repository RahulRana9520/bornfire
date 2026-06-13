import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface OnboardingStep {
  targetId: string;
  title: string;
  content: string;
  placement: Placement;
  requireInteraction?: boolean;
  interactionEvent?: string;
}

interface OnboardingContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: OnboardingStep | null;
  startOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  totalStepsInRoute: number;
}

const getCompletionKey = (route: string) => `tasksage_onboarding_completed_${route === '/' ? 'home' : route.replace('/', '')}`;

const ROUTE_STEPS: Record<string, OnboardingStep[]> = {
  '/': [
    {
      targetId: 'tour-add-task',
      title: 'Welcome to Focus Flow!',
      content: 'Let\'s start by adding your very first task for today. Create a task and click Add!',
      placement: 'bottom',
      requireInteraction: true,
      interactionEvent: 'task-added',
    },
    {
      targetId: 'tour-consistency',
      title: 'Weekly Consistency',
      content: 'This tracks your daily habits and tasks. Stay consistent to build up your streak!',
      placement: 'bottom',
    }
  ],
  '/week-goals': [
    {
      targetId: 'tour-add-habit',
      title: 'Goal Module',
      content: 'Here you can set long-term habits. Let\'s create a new habit to track your progress. Click the Add Habit button!',
      placement: 'bottom',
      requireInteraction: true,
      interactionEvent: 'habit-added',
    },
    {
      targetId: 'tour-week-progress',
      title: 'Track Progress',
      content: 'Monitor your weekly progress here. Watch your stats grow as you complete habits!',
      placement: 'bottom',
    }
  ],
  '/progress': [
    {
      targetId: 'tour-xp-chart',
      title: 'XP & Analytics',
      content: 'This is your command center. Watch your XP grow over time and analyze your daily focus sessions!',
      placement: 'bottom',
    }
  ],
  '/friends': [
    {
      targetId: 'tour-add-friend',
      title: 'Social Accountability',
      content: 'Add friends to share your journey and compete on the leaderboard!',
      placement: 'bottom',
    }
  ],
  '/chat': [
    {
      targetId: 'tour-squad-chat',
      title: 'Squad Chat',
      content: 'Invite friends with their unique code. You will chat here only with full encryption enabled!',
      placement: 'bottom'
    },
    {
      targetId: 'tour-global-chat',
      title: 'Global Feed',
      content: 'The global chat is live for all current users of the app. Say hi to the community!',
      placement: 'bottom'
    }
  ],
  '/group-games': [
    {
      targetId: 'tour-create-game',
      title: 'Focus Games',
      content: 'Let\'s take some break and play with friend for make your mood fresh.',
      placement: 'bottom'
    }
  ],
  '/leaderboard': [
    {
      targetId: 'tour-friend-rank',
      title: 'Squad Rankings',
      content: 'Check the leaderboard between your invited friends to see who is the most productive.',
      placement: 'bottom'
    },
    {
      targetId: 'tour-global-rank',
      title: 'Global Rankings',
      content: 'And here you can see your global rank among all students.',
      placement: 'bottom'
    }
  ]
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentRouteSteps = ROUTE_STEPS[location.pathname] || [];

  useEffect(() => {
    // Check if we should start onboarding for this route
    if (currentRouteSteps.length > 0) {
      const completionKey = getCompletionKey(location.pathname);
      const hasCompleted = localStorage.getItem(completionKey) === 'true';
      
      if (!hasCompleted && !isActive) {
        const timer = setTimeout(() => {
          setIsActive(true);
          setCurrentStepIndex(0);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setIsActive(false);
    }
  }, [location.pathname, currentRouteSteps.length, isActive]);

  const completeOnboarding = () => {
    setIsActive(false);
    localStorage.setItem(getCompletionKey(location.pathname), 'true');
  };

  const startOnboarding = () => {
    if (currentRouteSteps.length > 0) {
      setIsActive(true);
      setCurrentStepIndex(0);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < currentRouteSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const currentStep = isActive && currentStepIndex >= 0 && currentStepIndex < currentRouteSteps.length 
    ? currentRouteSteps[currentStepIndex] 
    : null;

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        startOnboarding,
        nextStep,
        prevStep,
        skipOnboarding,
        totalStepsInRoute: currentRouteSteps.length
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
