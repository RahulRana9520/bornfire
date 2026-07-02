import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { HabitsProvider } from "@/contexts/HabitsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";
import { NotificationScheduler } from "@/components/notifications/NotificationScheduler";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlacementProvider } from "@/contexts/PlacementContext";
import Dashboard from "@/pages/Dashboard";
import Today from "./pages/Today";
import WeekGoals from "./pages/WeekGoals";
import Progress from "./pages/Progress";
import Friends from "./pages/Friends";
import Chat from "./pages/Chat";
import GroupGames from "./pages/GroupGames";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import PlacementPrep from "@/pages/PlacementPrep";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient(); // Initialize QueryClient

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <HabitsProvider>
            <TaskProvider>
            <NotificationScheduler />
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <OnboardingProvider>
                <PlacementProvider>
                  <AppLayout>
                    <OnboardingOverlay />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/today" element={<Today />} />
                    <Route path="/week-goals" element={<WeekGoals />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/group-games" element={<GroupGames />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/placement-prep" element={<PlacementPrep />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
                </PlacementProvider>
              </OnboardingProvider>
            </BrowserRouter>
          </TooltipProvider>
        </TaskProvider>
      </HabitsProvider>
    </AuthProvider>
  </NotificationProvider>
  </ThemeProvider>
</QueryClientProvider>
);

export default App;
