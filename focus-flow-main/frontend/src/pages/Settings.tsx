import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, LogOut, Smartphone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { usePWA } from '@/hooks/usePWA';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTaskContext } from '@/contexts/TaskContext';

const Settings = () => {
  const { signOut } = useAuth();
  const { isInstallable, installApp } = usePWA();
  const { permission, requestPermission } = useNotifications();
  const { theme, toggleTheme, reduceAnimations, toggleReduceAnimations } = useTheme();
  const { userProfile, updatePrivacySettings } = useTaskContext();

  const settingsGroups = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Edit Profile', type: 'link' },
        { label: 'Change Password', type: 'link' },
        { label: 'Connected Accounts', type: 'link' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', type: 'toggle', defaultValue: true },
        { label: 'Daily Reminders', type: 'toggle', defaultValue: true },
        { label: 'Friend Activity', type: 'toggle', defaultValue: false },
        { label: 'Weekly Summary', type: 'toggle', defaultValue: true },
      ],
    },
    {
      title: 'Privacy',
      icon: Shield,
      items: [
        { label: 'Show Online Status', type: 'toggle', defaultValue: true },
        { label: 'Show Progress to Friends', type: 'toggle', defaultValue: true },
        { label: 'Appear on Leaderboard', type: 'toggle', defaultValue: true },
      ],
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Dark Mode', type: 'toggle', defaultValue: false },
        { label: 'Reduce Animations', type: 'toggle', defaultValue: false },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="bg-[#FFDE00] border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_#000]">
        <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-4 uppercase italic tracking-tighter">
          <SettingsIcon className="w-10 h-10" />
          Settings
        </h1>
        <p className="font-bold uppercase text-xs mt-2 tracking-widest opacity-70">
          Configure Your Focus Portal
        </p>
      </div>

      {/* PWA & Notification Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* install prompt */}
        {isInstallable && (
          <div className="bg-[#00E5BC] border-[4px] border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="w-14 h-14 bg-white border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                <Smartphone className="w-8 h-8 text-black" />
              </div>
              <div className="flex-1">
                <h3 className="font-black uppercase italic text-lg leading-none">Install Portal</h3>
                <p className="text-[10px] font-bold uppercase mt-1 opacity-70">Native mobile experience</p>
              </div>
            </div>
            <Button 
              onClick={installApp}
              className="w-full bg-black text-white border-[3px] border-black px-8 py-6 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#FFDE00] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <Download className="w-5 h-5 mr-3" />
              Download App
            </Button>
          </div>
        )}

        {/* notification prompt */}
        {permission !== 'granted' && (
          <div className="bg-[#FF89BB] border-[4px] border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="w-14 h-14 bg-white border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                <Bell className="w-8 h-8 text-black" />
              </div>
              <div className="flex-1">
                <h3 className="font-black uppercase italic text-lg leading-none">Enable Alerts</h3>
                <p className="text-[10px] font-bold uppercase mt-1 opacity-70">3 Daily Missions + Audits</p>
              </div>
            </div>
            <Button 
              onClick={requestPermission}
              className="w-full bg-black text-white border-[3px] border-black px-8 py-6 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#00E5BC] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <Bell className="w-5 h-5 mr-3" />
              Allow Notifications
            </Button>
          </div>
        )}
      </div>

      {/* Settings groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {settingsGroups.map((group) => (
          <div 
            key={group.title}
            className="bg-white border-[4px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden"
          >
            <div className="px-6 py-4 border-b-[4px] border-black bg-black text-white flex items-center gap-3">
              <group.icon className="w-5 h-5" />
              <h3 className="font-black uppercase italic tracking-widest text-sm">{group.title}</h3>
            </div>
            <div className="divide-y-[2px] divide-black">
              {group.items.map((item) => (
                <div 
                  key={item.label}
                  className={cn(
                    "flex items-center justify-between px-6 py-4",
                    item.type === 'link' && "hover:bg-[#FF89BB]/10 cursor-pointer transition-colors"
                  )}
                >
                  <span className="font-black uppercase text-xs tracking-wider">{item.label}</span>
                  {item.type === 'toggle' && (
                    <Switch 
                      checked={
                        item.label === 'Dark Mode' ? theme === 'dark' : 
                        item.label === 'Reduce Animations' ? reduceAnimations : 
                        item.label === 'Show Online Status' ? userProfile.privacy_show_online :
                        item.label === 'Show Progress to Friends' ? userProfile.privacy_show_progress :
                        item.label === 'Appear on Leaderboard' ? userProfile.privacy_show_leaderboard :
                        undefined
                      }
                      defaultChecked={
                        item.label !== 'Dark Mode' && 
                        item.label !== 'Reduce Animations' && 
                        !item.label.includes('Show') && 
                        !item.label.includes('Appear') ? item.defaultValue : undefined
                      }
                      onCheckedChange={(checked) => {
                        if (item.label === 'Dark Mode') toggleTheme();
                        else if (item.label === 'Reduce Animations') toggleReduceAnimations();
                        else if (item.label === 'Show Online Status') updatePrivacySettings('privacy_show_online', checked);
                        else if (item.label === 'Show Progress to Friends') updatePrivacySettings('privacy_show_progress', checked);
                        else if (item.label === 'Appear on Leaderboard') updatePrivacySettings('privacy_show_leaderboard', checked);
                      }}
                      className="data-[state=checked]:bg-[#00E5BC] border-2 border-black" 
                    />
                  )}
                  {item.type === 'link' && (
                    <Download className="w-4 h-4 -rotate-90" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-[#FF89BB]/10 border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_#000]">
        <h3 className="font-black uppercase italic text-destructive text-xl mb-6">Danger Zone</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            onClick={() => signOut()}
            className="flex-1 bg-white border-[3px] border-black px-6 py-6 font-black uppercase text-destructive shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Emergency Sign Out
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-white border-[3px] border-black px-6 py-6 font-black uppercase text-destructive shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Decommission Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

