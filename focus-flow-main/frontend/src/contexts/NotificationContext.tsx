import React, { createContext, useContext, useEffect, useState } from 'react';

interface NotificationContextType {
  permission: NotificationPermission;
  requestPermission: () => Promise<void>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/pwa-512x512.png',
          badge: '/pwa-512x512.png',
          ...options,
        });
      });
    } else {
      new Notification(title, options);
    }
  };

  return (
    <NotificationContext.Provider value={{ permission, requestPermission, sendNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
