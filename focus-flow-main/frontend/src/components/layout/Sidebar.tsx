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
  LogIn,
  User,
  Gamepad2,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePWA } from '@/hooks/usePWA';
import { AuthModal } from '@/components/auth/AuthModal';
import { getLeagueName } from '@/lib/taskUtils';
import { UserMenu } from './UserMenu';
import { X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

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
  { to: '/group-games', icon: Gamepad2, label: 'Group Games' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const { userProfile } = useTaskContext();
  const { user } = useAuth();
  const { isInstallable, installApp } = usePWA();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeagueModal, setShowLeagueModal] = useState(false);

  return (
    <>
      {/* Sidebar — Desktop only */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-[100dvh] w-72 bg-white border-r-[4px] border-black",
          "flex-col overflow-hidden",
          /* Hidden on mobile, visible on desktop */
          "hidden lg:flex"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-[4px] border-black bg-[#FFDE00] relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-[3px] border-black bg-white flex items-center justify-center p-1 shadow-[2px_2px_0px_0px_#000]">
               <img src="/app.png" alt="Logo" className="w-full h-full" />
            </div>
            <span className="font-black text-2xl text-black tracking-tighter uppercase">Bornfire</span>
          </div>
          <button
            onClick={toggleTheme}
            className="absolute bottom-2 right-2 w-8 h-8 border-[2px] border-black bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_#000]"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-black stroke-[3px]" /> : <Sun className="w-4 h-4 text-black stroke-[3px]" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
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
                  ID: {userProfile.uniqueId || '#BF-PENDING'}
                </p>
                <div 
                  className="mt-1 flex items-center gap-2 cursor-pointer hover:opacity-80 active:translate-y-[1px] transition-all"
                  onClick={() => setShowLeagueModal(true)}
                  title="View League Levels"
                >
                  <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shadow-[1px_1px_0px_0px_#000] p-0.5">
                    <img 
                      src={`/badges/${userProfile.league}.png`} 
                      alt={userProfile.league} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 border-2 border-black text-[10px] font-black uppercase transition-colors hover:bg-black hover:text-white",
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
                <span className="text-black">{userProfile.xp % 1500} / 1500 XP</span>
              </div>
              <div className="h-4 border-[3px] border-black bg-white overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                <div 
                  className="h-full bg-[#FFDE00] border-r-[3px] border-black"
                  style={{ width: `${(userProfile.xp % 1500) / 15}%` }}
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

          </div>
        </div>
      </aside>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        canDismiss={true}
      />

      {/* League Levels Modal */}
      {showLeagueModal && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-4xl bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 md:p-8 pt-12 sm:pt-8 relative flex flex-col max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Close button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-none shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none z-50"
              onClick={() => setShowLeagueModal(false)}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter bg-[#FFDE00] border-[4px] border-black py-2 sm:py-3 px-4 sm:px-6 inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1 max-w-full break-words">
                🏆 League Levels 🏆
              </h2>
              <p className="text-xs font-black uppercase text-[#555] tracking-widest mt-6">
                Your Bornfire Level determines your League!
              </p>
            </div>

            {/* Leagues Comparison Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-4">
              {[
                { name: 'Bronze', levels: 'LVL 1 - 19', bg: 'bg-[#ff7a00]/10' },
                { name: 'Silver', levels: 'LVL 20 - 39', bg: 'bg-[#a0a0a0]/10' },
                { name: 'Gold', levels: 'LVL 40 - 59', bg: 'bg-[#ffd700]/10' },
                { name: 'Platinum', levels: 'LVL 60 - 79', bg: 'bg-[#00e5bc]/10' },
                { name: 'Diamond', levels: 'LVL 80+', bg: 'bg-[#00ccff]/10' },
              ].map((lg) => {
                const isCurrent = lg.name.toLowerCase() === userProfile.league;
                return (
                  <div 
                    key={lg.name}
                    className={cn(
                      "border-[3px] sm:border-[4px] border-black p-3 sm:p-4 flex flex-col items-center text-center relative",
                      lg.bg,
                      isCurrent ? "shadow-[4px_4px_0px_0px_#000] bg-yellow-50" : ""
                    )}
                  >
                    {isCurrent && (
                      <span className="absolute -top-3 bg-black text-white text-[8px] font-black uppercase px-2 py-0.5 border-2 border-black tracking-widest">
                        Current
                      </span>
                    )}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-[3px] border-black bg-white flex items-center justify-center p-1 sm:p-1.5 shadow-[2px_2px_0px_0px_#000] mb-3 sm:mb-4">
                      <img 
                        src={`/badges/${lg.name.toLowerCase()}.png`} 
                        alt={lg.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <h3 className="font-black text-sm sm:text-lg uppercase tracking-tight mb-1">{lg.name}</h3>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-[#555] tracking-wider mb-2 sm:mb-3">League</span>
                    <div className="w-full border-t-2 border-black border-dashed my-1 sm:my-2" />
                    <div className="bg-white border-2 border-black py-1 px-2 sm:px-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                      {lg.levels}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom info section */}
            <div className="mt-4 border-[3px] border-black bg-[#00E5BC]/10 p-4 text-center">
              <p className="text-xs font-black uppercase leading-relaxed">
                Complete tasks, run focus sessions, and maintain your streak to gain XP. 
                Keep leveling up to reach the legendary <span className="text-[#00c8ff]">Diamond League</span>! 💎
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
