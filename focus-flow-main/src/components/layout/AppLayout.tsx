import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { AuthModal } from '@/components/auth/AuthModal';
import { CheckInModal } from '@/components/auth/CheckInModal';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useLocalStorage<string | null>('focusflow_last_checkin', null);
  
  const { user, shouldShowSignInPrompt, dismissSignInPrompt } = useAuth();
  const { userProfile, updateStreak } = useTaskContext();

  // Check if auth modal should be shown
  useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldShowSignInPrompt()) {
        setShowAuthModal(true);
      }
    }, 2000); // Show after 2 seconds on page

    return () => clearTimeout(timer);
  }, [shouldShowSignInPrompt]);

  // Check if daily check-in should be shown
  useEffect(() => {
    if (!user) return;

    const today = new Date().toDateString();
    const shouldShowCheckIn = lastCheckIn !== today;

    if (shouldShowCheckIn) {
      // Show check-in modal after a short delay
      const timer = setTimeout(() => {
        setShowCheckInModal(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, lastCheckIn]);

  const handleCheckIn = () => {
    const today = new Date().toDateString();
    setLastCheckIn(today);
    if (updateStreak) {
      updateStreak();
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    dismissSignInPrompt();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className={cn(
        "flex-1 min-h-screen",
        "transition-all duration-300 ease-out",
        "lg:ml-72"
      )}>
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-16 sm:pt-20 lg:pt-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        canDismiss={true}
      />

      {/* Daily Check-in Modal */}
      <CheckInModal
        isOpen={showCheckInModal}
        streak={userProfile.streak}
        onCheckIn={handleCheckIn}
        onClose={() => setShowCheckInModal(false)}
      />
    </div>
  );
}

