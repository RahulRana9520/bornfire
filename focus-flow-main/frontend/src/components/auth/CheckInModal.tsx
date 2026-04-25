import React, { useState } from 'react';
import { Flame, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CheckInModalProps {
  isOpen: boolean;
  streak: number;
  onCheckIn: () => void;
  onClose: () => void;
}

export function CheckInModal({ isOpen, streak, onCheckIn, onClose }: CheckInModalProps) {
  const [checking, setChecking] = useState(false);

  if (!isOpen) return null;

  const handleCheckIn = async () => {
    setChecking(true);
    await onCheckIn();
    setTimeout(() => {
      setChecking(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-card rounded-2xl border border-border shadow-2xl p-6 sm:p-8 animate-scale-in text-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Flame icon */}
          <div className={cn(
            "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center",
            checking ? "bg-success/20" : "bg-warning/20 animate-pulse"
          )}>
            {checking ? (
              <Check className="w-10 h-10 text-success" />
            ) : (
              <Flame className="w-10 h-10 text-warning" />
            )}
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold mb-2">
            {checking ? 'Checked In!' : 'Daily Check-In'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {checking
              ? `You've maintained your ${streak + 1} day streak! 🎉`
              : `Keep your ${streak} day streak alive by completing at least one task today`}
          </p>

          {/* Streak counter */}
          {!checking && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
              <div className="text-4xl font-bold text-warning mb-1">{streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          )}

          {/* Actions */}
          {!checking && (
            <Button onClick={handleCheckIn} className="w-full" size="lg">
              <Flame className="w-5 h-5 mr-2" />
              Check In Now
            </Button>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Complete at least one task today to maintain your streak
          </p>
        </div>
      </div>
    </div>
  );
}
