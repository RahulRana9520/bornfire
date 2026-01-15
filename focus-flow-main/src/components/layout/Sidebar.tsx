import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Users, 
  Trophy, 
  Settings,
  Sparkles,
  Menu,
  X,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { getLeagueName } from '@/lib/taskUtils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/', icon: Calendar, label: 'Today' },
  { to: '/week-goals', icon: Target, label: 'Week Goals' },
  { to: '/progress', icon: TrendingUp, label: 'Daily Progress' },
  { to: '/friends', icon: Users, label: 'Watch Friends' },
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
          "fixed left-0 top-0 z-50 h-screen w-72 bg-sidebar/95 backdrop-blur-md border-r border-sidebar-border shadow-xl",
          "transform transition-all duration-300 ease-out",
          "flex flex-col overflow-hidden flex-shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:fixed lg:bg-sidebar"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border bg-sidebar/50">
          <div className="flex items-center gap-3">
            <img src="/app.png" alt="FocusFlow Logo" className="w-10 h-10 rounded-xl shadow-lg" />
            <span className="font-bold text-xl text-foreground tracking-tight">FocusFlow</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className="lg:hidden hover:bg-sidebar-accent transition-colors"
            onClick={onToggle}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                  "transition-all duration-200 relative overflow-hidden group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-0.5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive && "text-primary scale-110"
                )} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Profile Card */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar/50 flex-shrink-0">
          <div className="bg-gradient-to-br from-accent/80 to-accent/50 rounded-xl p-4 space-y-3 shadow-soft hover:shadow-md transition-shadow">
            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
                <span className="text-xl font-bold text-primary">
                  {userProfile.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-foreground">
                  {userProfile.username}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-semibold text-primary-foreground",
                    `league-${userProfile.league}`
                  )}>
                    {getLeagueName(userProfile.league)}
                  </span>
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">Level {userProfile.level}</span>
                <span className="font-semibold text-gold">{userProfile.xp} XP</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-gold via-warning to-gold rounded-full transition-all duration-500 animate-shimmer"
                  style={{ 
                    width: `${(userProfile.xp % 400) / 4}%`,
                    backgroundSize: '200% 100%'
                  }}
                />
              </div>
            </div>

            {/* Auth Status */}
            {user ? (
              <div className="mt-3 pt-3 border-t border-sidebar-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <User className="w-3 h-3" />
                  <span className="truncate">{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-sidebar-border">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setShowAuthModal(true)}
                >
                  <LogIn className="w-3 h-3 mr-1" />
                  Sign In
                </Button>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  Sign in to sync across devices
                </p>
              </div>
            )}

            {/* Streak */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-muted-foreground font-medium">Current Streak</span>
              <div className="flex items-center gap-1.5 bg-warning-light px-2 py-1 rounded-full">
                <span className="text-base">🔥</span>
                <span className="font-bold text-warning-foreground">{userProfile.streak} days</span>
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
          "fixed top-4 left-4 z-[60] lg:hidden shadow-lg hover:shadow-xl transition-all",
          "bg-primary text-primary-foreground",
          isOpen && "opacity-0 pointer-events-none scale-90"
        )}
        onClick={onToggle}
      >
        <Menu className="w-5 h-5" />
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
