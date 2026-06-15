import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { CheckInModal } from '@/components/auth/CheckInModal';

import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  
  const { user, shouldShowSignInPrompt, dismissSignInPrompt } = useAuth();
  const { userProfile, updateStreak, lastCheckIn, setLastCheckIn } = useTaskContext();


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

  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="min-h-[100dvh] bg-white flex">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className={cn(
        "flex-1 min-w-0 min-h-[100dvh] w-full",
        "lg:ml-72"
      )}>
        <div className={cn(
          "w-full",
          isChatPage 
            ? "min-h-[100dvh]" 
            : [
                /* Mobile: compact padding, bottom nav clearance */
                "px-4 py-4 pb-24",
                /* Tablet */
                "sm:px-5 sm:py-5",
                /* Desktop */
                "lg:px-8 lg:py-8 lg:pb-8",
                "max-w-6xl mx-auto"
              ].join(" ")
        )}>
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <BottomNav />

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
