import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Target, 
  MessageSquare, 
  Trophy, 
  LineChart,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

const bottomNavItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/today', icon: LayoutGrid, label: 'Today' },
  { to: '/week-goals', icon: Target, label: 'Goals' },
  { to: '/placement-prep', icon: Target, label: 'Prep' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
        /* Explicit background for light AND dark — not using bg-white so the .dark override doesn't break icon visibility */
        "bg-[#ffffff] dark:bg-[#111111] border-t-[3px] border-black dark:border-[#888]",
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
              "flex flex-col items-center justify-center flex-1 relative",
              "min-h-[44px] min-w-[44px]", /* 44px tap target */
              "text-[10px] font-black uppercase tracking-tight",
              "transition-colors duration-150",
              isActive
                ? "text-black dark:text-white bg-[#FFDE00]/30 dark:bg-[#FFDE00]/20"
                : "text-black/50 dark:text-white/50 active:bg-black/5 dark:active:bg-white/5"
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
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-black dark:bg-white rounded-t-full" />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
