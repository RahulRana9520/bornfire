import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AuthModal } from '@/components/auth/AuthModal';
import { CheckInModal } from '@/components/auth/CheckInModal';
import { InstallModal } from '@/components/auth/InstallModal';
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
  const [showInstallModal, setShowInstallModal] = useState(false);
  
  const { user, shouldShowSignInPrompt, dismissSignInPrompt } = useAuth();
  const { userProfile, updateStreak, lastCheckIn, setLastCheckIn } = useTaskContext();
  const { isInstallable } = usePWA();

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
    } else if (isInstallable) {
      // If no check-in needed, show PWA prompt
      const timer = setTimeout(() => {
        setShowInstallModal(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [user, lastCheckIn, isInstallable]);

  const handleCheckIn = () => {
    const today = new Date().toDateString();
    setLastCheckIn(today);
    if (updateStreak) {
      updateStreak();
    }
    // After check-in, if installable, show PWA prompt after a delay
    if (isInstallable) {
      setTimeout(() => setShowInstallModal(true), 2000);
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    dismissSignInPrompt();
  };

  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className={cn(
        "flex-1 min-h-screen",
        "transition-all duration-300 ease-out",
        "lg:ml-72"
      )}>
        <div className={cn(
          "animate-fade-in transition-all duration-300",
          isChatPage 
            ? "w-full min-h-screen" 
            : "max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-10 lg:pt-8"
        )}>
          {children}
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

      {/* PWA Install Modal */}
      <InstallModal 
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}

