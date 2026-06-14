import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Target, 
  MessageSquare, 
  Trophy, 
  User,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const bottomNavItems = [
  { to: '/', icon: LayoutGrid, label: 'Today' },
  { to: '/week-goals', icon: Target, label: 'Goals' },
  { to: '/progress', icon: LineChart, label: 'Progress' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/leaderboard', icon: Trophy, label: 'Ranks' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
        "bg-white border-t-[3px] border-black",
        "flex items-stretch justify-around",
        "h-[4rem]",
        "shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {bottomNavItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center flex-1",
              "min-h-[44px] min-w-[44px]", /* 44px tap target */
              "text-[10px] font-black uppercase tracking-tight",
              "transition-colors duration-150",
              isActive
                ? "text-black bg-[#FFDE00]/30"
                : "text-black/50 active:bg-black/5"
            )}
          >
            <item.icon 
              className={cn(
                "w-5 h-5 mb-0.5 stroke-[2.5px]",
                isActive && "stroke-[3px]"
              )} 
            />
            <span>{item.label}</span>
            {isActive && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-black rounded-t-full" />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
