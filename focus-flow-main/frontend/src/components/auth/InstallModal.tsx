import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal = ({ isOpen, onClose }: InstallModalProps) => {
  const { isInstallable, installApp, dismissPrompt } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTips, setShowIOSTips] = useState(false);

  useEffect(() => {
    // Check if on iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (isOpen && (isInstallable || ios)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, isInstallable]);

  const handleSkip = () => {
    dismissPrompt();
    onClose();
  };

  const handleInstall = async () => {
    if (isIOS) {
       setShowIOSTips(true);
       return;
    }
    await installApp();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_#000] p-8 animate-in zoom-in-95 duration-300">
        
        {/* Decorative Corner */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FFDE00] border-[4px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] rotate-[-12deg]">
          <Zap className="w-6 h-6 text-black" />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 border-2 border-black hover:bg-black hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-6 mt-4">
          <div className="inline-flex w-20 h-20 bg-[#00E5BC] border-[4px] border-black items-center justify-center shadow-[6px_6px_0px_0px_#000] mb-2">
            <Smartphone className="w-10 h-10 text-black" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
              {isIOS ? 'Mobile Access' : 'Portal Ready'}
            </h2>
            <p className="font-bold text-xs uppercase tracking-widest opacity-60">
              {isIOS ? 'Safari Optimization' : 'Mobile Installation Detected'}
            </p>
          </div>

          <div className={cn(
            "p-4 bg-black/5 border-2 border-black border-dashed transition-all duration-500",
            showIOSTips && "bg-[#00E5BC]/20 border-[#00E5BC] scale-[1.02] border-solid"
          )}>
            {isIOS ? (
              <div className="space-y-3">
                 <p className={cn("text-sm font-black uppercase italic transition-colors", showIOSTips ? "text-success" : "text-black")}>
                   {showIOSTips ? '🔥 FOLLOW THESE STEPS:' : 'To install on iPhone:'}
                 </p>
                 <div className="flex flex-col gap-2 text-[10px] font-bold uppercase text-left">
                    <div className="flex items-center gap-2">
                       <span className="w-5 h-5 bg-black text-white flex items-center justify-center">1</span>
                       <span>Tap the [Share Icon] at bottom</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="w-5 h-5 bg-black text-white flex items-center justify-center">2</span>
                       <span>Scroll and tap "Add to Home Screen"</span>
                    </div>
                 </div>
              </div>
            ) : (
              <p className="text-sm font-bold leading-relaxed italic">
                "Install Bornfire to your home screen for instant squad updates and offline productivity."
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-4">
            {!isIOS ? (
              <button 
                onClick={handleInstall}
                className="w-full h-16 bg-[#FFDE00] text-black border-[4px] border-black font-black uppercase text-lg tracking-widest shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95"
              >
                <Download className="w-6 h-6 mr-3" />
                Install Portal
              </button>
            ) : (
                <button 
                onClick={showIOSTips ? onClose : handleInstall}
                className={cn(
                  "w-full h-16 text-black border-[4px] border-black font-black uppercase text-lg tracking-widest shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95",
                  showIOSTips ? "bg-white" : "bg-[#FFDE00]"
                )}
              >
                {showIOSTips ? 'Got It!' : 'See Instructions'}
              </button>
            )}
            
            <button 
              onClick={handleSkip}
              className="text-[10px] font-black uppercase tracking-[4px] opacity-40 hover:opacity-100 hover:text-destructive transition-all"
            >
              [ SKIP FOR NOW ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
