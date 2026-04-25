import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Target, 
  LineChart, 
  Users, 
  MessageSquare, 
  Trophy, 
  Settings, 
  ChevronRight,
  LogOut,
  Calendar,
  X,
  LogIn,
  User,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { getLeagueName } from '@/lib/taskUtils';
import { UserMenu } from './UserMenu';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'Today' },
  { to: '/week-goals', icon: Target, label: 'Week Goals' },
  { to: '/progress', icon: LineChart, label: 'Daily Progress' },
  { to: '/friends', icon: Users, label: 'Watch Friends' },
  { to: '/chat', icon: MessageSquare, label: 'Squad Chat' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const { userProfile } = useTaskContext();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-[280px] sm:w-72 bg-white border-r-[4px] border-black",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:fixed"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-[4px] border-black bg-[#FFDE00]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-[3px] border-black bg-white flex items-center justify-center p-1 shadow-[2px_2px_0px_0px_#000]">
               <img src="/app.png" alt="Logo" className="w-full h-full" />
            </div>
            <span className="font-black text-2xl text-black tracking-tighter uppercase">FocusFlow</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden border-2 border-black bg-white hover:bg-black hover:text-white transition-none"
            onClick={onToggle}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 border-[3px] border-black font-black uppercase text-sm transition-none",
                  isActive
                    ? "bg-[#00E5BC] translate-x-[2px] translate-y-[2px] shadow-none"
                    : "bg-white shadow-[4px_4px_0px_0px_#000] hover:bg-[#FF89BB] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                )}
              >
                <item.icon className={cn(
                  "w-6 h-6 transition-none flex-shrink-0",
                  isActive && "scale-110"
                )} />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Profile Card */}
        <div className="p-4 border-t-[4px] border-black bg-[#FF89BB]/10">
          <div className="neo-brutal-white p-4 space-y-4">
            {/* User info & Sign Out */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="border-[3px] border-black shadow-[2px_2px_0px_0px_#000]">
                  <UserMenu />
                </div>
              ) : (
                <div className="w-12 h-12 border-[3px] border-black bg-white flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                  <User className="w-6 h-6 text-black" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm uppercase truncate tracking-tight">
                  {user ? (userProfile.username !== 'StudyMaster' ? userProfile.username : (user.email?.split('@')[0])) : 'Guest User'}
                </p>
                <p className="text-[9px] font-black font-mono text-[#777] leading-none mb-1">
                  ID: {userProfile.uniqueId || '#FF-PENDING'}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shadow-[1px_1px_0px_0px_#000] p-0.5">
                    <img 
                      src={`/badges/${userProfile.league}.png`} 
                      alt={userProfile.league} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 border-2 border-black text-[10px] font-black uppercase",
                    `league-${userProfile.league}`
                  )}>
                    {getLeagueName(userProfile.league)}
                  </span>
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>LVL {userProfile.level}</span>
                <span className="text-black">{userProfile.xp} XP</span>
              </div>
              <div className="h-4 border-[3px] border-black bg-white overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                <div 
                  className="h-full bg-[#FFDE00] border-r-[3px] border-black"
                  style={{ width: `${(userProfile.xp % 400) / 4}%` }}
                />
              </div>
            </div>

            {/* Auth Button (only for Guest) */}
            {!user && (
              <Button
                variant="default"
                size="sm"
                className="w-full neo-brutal-yellow font-black uppercase py-6"
                onClick={() => setShowAuthModal(true)}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            )}

            {/* Streak */}
            <div className="flex items-center justify-between pt-2 border-t-2 border-black dashed">
              <span className="text-[10px] font-black uppercase">STREAK</span>
              <div className="flex items-center gap-1 bg-[#00E5BC] border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
                <span className="font-black text-xs">{userProfile.streak}D</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <Button
        variant="default"
        size="icon"
        className={cn(
          "fixed top-3 left-3 sm:top-4 sm:left-4 z-[60] lg:hidden shadow-lg hover:shadow-xl transition-all",
          "bg-primary text-primary-foreground w-12 h-12 sm:w-10 sm:h-10",
          isOpen && "opacity-0 pointer-events-none scale-90"
        )}
        onClick={onToggle}
      >
        <Menu className="w-6 h-6 sm:w-5 sm:h-5" />
      </Button>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        canDismiss={true}
      />
    </>
  );
}
