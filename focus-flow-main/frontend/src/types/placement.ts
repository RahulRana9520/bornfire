export interface PlacementTask {
  id: string;
  title: string;
  category: string;
  estimatedMinutes: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  xpReward: number;
  isCarryForward?: boolean;
}

export interface DailyPlacementPlan {
  dayNumber: number;
  date: string; // ISO string
  title: string;
  tasks: PlacementTask[];
  isMockTestDay?: boolean;
  isReviewDay?: boolean;
}

export interface PlacementProfile {
  targetCompany: string;
  roleType: string;
  daysAvailable: number;
  dailyHours: number;
  currentLevel: string;
  focusAreas: string[];
  weakAreas: string[];
  startDate: string; // ISO string
  isSetupComplete: boolean;
}

export interface PlacementPlanData {
  profile: PlacementProfile;
  roadmap: DailyPlacementPlan[];
}
