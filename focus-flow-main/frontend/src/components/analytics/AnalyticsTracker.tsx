import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-GPF0P9HQNR', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}
