import React from 'react';
import { UserMenu } from './UserMenu';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 h-16 sm:h-20 bg-background/95 backdrop-blur-md border-b border-sidebar-border z-[60] lg:left-72 shadow-sm">
      <div className="h-full w-full px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent hidden sm:block">
            FocusFlow
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-primary">
            <Sparkles className="w-5 h-5" />
          </Button>
          
          <div className="h-8 w-[1px] bg-border/50 mx-1 hidden sm:block" />
          
          {user ? (
            <UserMenu />
          ) : (
            <div className="text-xs text-muted-foreground font-medium animate-pulse">
              Sign in to save progress
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
