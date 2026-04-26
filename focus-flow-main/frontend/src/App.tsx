import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { HabitsProvider } from "@/contexts/HabitsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { NotificationScheduler } from "@/components/notifications/NotificationScheduler";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import WeekGoals from "./pages/WeekGoals";
import Progress from "./pages/Progress";
import Friends from "./pages/Friends";
import Chat from "./pages/Chat";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <AuthProvider>
        <HabitsProvider>
          <TaskProvider>
            <NotificationScheduler />
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/week-goals" element={<WeekGoals />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/friends" element={<Friends />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </BrowserRouter>
          </TooltipProvider>
        </TaskProvider>
      </HabitsProvider>
    </AuthProvider>
  </NotificationProvider>
</QueryClientProvider>
);

export default App;
