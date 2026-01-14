import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const Settings = () => {
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize your TaskSage experience
        </p>
      </div>

      {/* Settings groups */}
      <div className="space-y-6">
        {settingsGroups.map((group) => (
          <div 
            key={group.title}
            className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden"
          >
            <div className="px-4 py-3 bg-accent/50 border-b border-border/50 flex items-center gap-2">
              <group.icon className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">{group.title}</h3>
            </div>
            <div className="divide-y divide-border/50">
              {group.items.map((item, index) => (
                <div 
                  key={item.label}
                  className={cn(
                    "flex items-center justify-between px-4 py-3",
                    item.type === 'link' && "hover:bg-accent/50 cursor-pointer transition-colors"
                  )}
                >
                  <span className="text-sm">{item.label}</span>
                  {item.type === 'toggle' && (
                    <Switch defaultChecked={item.defaultValue} />
                  )}
                  {item.type === 'link' && (
                    <span className="text-muted-foreground">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-destructive/5 rounded-xl border border-destructive/20 p-4">
        <h3 className="font-medium text-destructive mb-3">Danger Zone</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
