import { useState, useEffect } from 'react';

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if already running as an app
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone || 
                           document.referrer.includes('android-app://');
    
    setIsStandalone(checkStandalone);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      
      // Only show if NOT standalone AND NOT already skipped
      const hasSkipped = localStorage.getItem('focusflow_pwa_skipped') === 'true';
      if (!checkStandalone && !hasSkipped) {
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
