import React, { useState, useEffect } from 'react';
import { Loader2, User, Key, Link as LinkIcon, Github, Chrome, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserIdentity } from '@supabase/supabase-js';

export type AccountAction = 'edit_profile' | 'change_password' | 'connected_accounts' | 'delete_account' | null;

interface AccountSettingsModalProps {
  action: AccountAction;
  onClose: () => void;
}

const AccountSettingsModal = ({ action, onClose }: AccountSettingsModalProps) => {
  // @ts-ignore - we just added updateUsername to TaskContext
  const { userProfile, updatePrivacySettings, updateUsername } = useTaskContext();
  const { signOut } = useAuth();
  
  // States
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Edit Profile States
  const [username, setUsername] = useState(userProfile?.username || '');

  // Change Password States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Connected Accounts States
  const [identities, setIdentities] = useState<UserIdentity[]>([]);

  useEffect(() => {
    if (action === 'edit_profile' && userProfile?.username) {
      setUsername(userProfile.username);
    }
    if (action === 'connected_accounts') {
      fetchIdentities();
    }
    // Reset states
    setLoading(false);
    setSuccess(null);
    setError(null);
    setNewPassword('');
    setConfirmPassword('');
  }, [action, userProfile]);

  const fetchIdentities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.getUserIdentities();
      if (error) throw error;
      setIdentities(data?.identities || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // @ts-ignore - we just added updateUsername to TaskContext
      if (updateUsername) await updateUsername(username);
      
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      // Sometimes errors come as err.message, sometimes err.error_description
      setError(err.message || 'Failed to update username. The username might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('users').delete().eq('id', user.id);
      if (error) throw error;

      await signOut();
    } catch (err: any) {
      setError(err.message || 'Failed to decompose account');
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (action) {
      case 'edit_profile':
        return (
          <form onSubmit={handleEditProfile} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="neo-input h-14 text-lg font-bold"
                placeholder="Enter new username"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full neo-brutal-teal h-14 font-black uppercase tracking-widest text-black"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
            </Button>
          </form>
        );

      case 'change_password':
        return (
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-70">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="neo-input h-14 text-lg font-bold"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="neo-input h-14 text-lg font-bold"
                placeholder="••••••••"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full neo-brutal-yellow h-14 font-black uppercase tracking-widest text-black"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
            </Button>
          </form>
        );

      case 'connected_accounts':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Active Connections</label>
              
              {loading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin" /></div>
              ) : identities.length === 0 ? (
                <div className="p-4 border-[3px] border-black bg-black/5 font-bold text-sm text-center">
                  No connected accounts found.
                </div>
              ) : (
                identities.map((identity) => (
                  <div key={identity.id} className="flex items-center justify-between p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_#000]">
                    <div className="flex items-center gap-3">
                      {identity.provider === 'google' ? <Chrome className="w-5 h-5" /> : 
                       identity.provider === 'github' ? <Github className="w-5 h-5" /> : 
                       <User className="w-5 h-5" />}
                      <span className="font-black uppercase tracking-widest">{identity.provider}</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t-[3px] border-black space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Link New Accounts</label>
              <p className="text-xs font-bold text-muted-foreground">Sign out and use the Google or GitHub buttons on the login screen to link new OAuth providers to this email.</p>
            </div>
          </div>
        );

      case 'delete_account':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-red-100 border-[3px] border-red-500 text-red-700 font-bold text-sm uppercase tracking-wider">
              Warning: This action is irreversible. If you decompose your account, it will be totally deleted and not recoverable. All your data, tasks, and leaderboard rankings will be permanently removed.
            </div>
            
            <Button 
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white border-[3px] border-black h-14 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#000]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Yes, Decompose My Account'}
            </Button>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outline"
              className="w-full bg-white border-[3px] border-black h-14 font-black uppercase tracking-widest text-black shadow-[4px_4px_0px_0px_#000]"
            >
              Cancel
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  const titles = {
    edit_profile: { title: 'Edit Profile', icon: User },
    change_password: { title: 'Change Password', icon: Key },
    connected_accounts: { title: 'Connected Accounts', icon: LinkIcon },
    delete_account: { title: 'Decompose Account', icon: AlertTriangle },
  };

  if (!action) return null;
  const { title, icon: Icon } = titles[action];

  return (
    <Dialog open={action !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="neo-brutal-white sm:max-w-md p-0 overflow-hidden border-[4px] border-black">
        <DialogHeader className="p-6 bg-[#FFDE00] border-b-[4px] border-black">
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <Icon className="w-6 h-6" />
            {title}
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-black/70">
            Manage your Bornfire account
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-[3px] border-red-500 text-red-700 font-bold text-sm uppercase tracking-wider">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-[3px] border-green-500 text-green-700 font-bold text-sm uppercase tracking-wider">
              {success}
            </div>
          )}
          
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsModal;
