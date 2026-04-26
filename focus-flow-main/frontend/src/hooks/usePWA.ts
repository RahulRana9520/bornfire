import { useState, useEffect } from 'react';

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Aggressive Standalone Detection
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator as any).standalone === true || 
             document.referrer.includes('android-app://') ||
             // Helper: If the window is launched without typical browser UI
             (window.outerHeight - window.innerHeight < 40); 
    };
    
    const isApp = checkStandalone();
    setIsStandalone(isApp);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      
      // If already an app, don't even listen
      if (isApp) return;

      const hasSkipped = localStorage.getItem('focusflow_pwa_skipped') === 'true';
      if (!hasSkipped) {
        setDeferredPrompt(e);
        setIsInstallable(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('focusflow_pwa_skipped', 'true');
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const dismissPrompt = () => {
    localStorage.setItem('focusflow_pwa_skipped', 'true');
    setIsInstallable(false);
  };

  return { isInstallable, isStandalone, installApp, dismissPrompt };
}
