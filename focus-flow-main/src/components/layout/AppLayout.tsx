import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className={cn(
        "flex-1 min-h-screen",
        "transition-all duration-300 ease-out",
        "lg:ml-72"
      )}>
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
