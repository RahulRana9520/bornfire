import React, { useState } from 'react';
import { Mail, Github, Chrome, X, LogIn, UserPlus, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  canDismiss?: boolean;
}

export function AuthModal({ isOpen, onClose, canDismiss = true }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signInWithEmail, signUpWithEmail } = useAuth();

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isSupabaseConfigured()) {
      setError('Auth Error: Credentials Required.');
      return;
    }
    
    setLoading(true);

    try {
      const { error } = mode === 'signin'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password, username);

      if (error) {
        setError(error.message);
      } else {
        onClose();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFDE00] p-4 overflow-hidden">
      {/* Neo-Brutalist Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      
      {/* Floating Shapes */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#FF89BB] rounded-full border-[6px] border-black shadow-[10px_10px_0px_0px_#000]" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#00E5BC] border-[6px] border-black shadow-[10px_10px_0px_0px_#000] rotate-12" />

      <div className="relative w-full max-w-[500px]">
        {/* The Portal Card */}
        <div className="bg-white border-[6px] border-black shadow-[16px_16px_0px_0px_#000] rounded-[40px] p-8 sm:p-12 animate-scale-in">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-block bg-black text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-4">
              {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
            </div>
            <h2 className="text-[36px] font-black uppercase italic tracking-tighter leading-none mb-2">
              {mode === 'signin' ? 'Bornfire' : 'Join Us'}
            </h2>
            <p className="text-[11px] font-bold text-[#555] uppercase tracking-wider">
              {mode === 'signin'
                ? 'Sign in to sync your progress'
                : 'Create an account to track productivity'}
            </p>
          </div>

          {/* Config Warning */}
          {!isSupabaseConfigured() && (
            <div className="mb-6 p-4 border-[3px] border-black bg-[#FF89BB] shadow-[4px_4px_0px_0px_#000] text-black font-black uppercase text-[10px]">
              Auth Config Missing: Set up .env
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_#000] text-red-600 font-bold text-xs">
              {error}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleEmailAuth} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[10px] font-black uppercase text-[#777] ml-2">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="neo-input h-14 text-sm font-bold"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase text-[#777] ml-2">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neo-input h-14 text-sm font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase text-[#777] ml-2">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neo-input h-14 text-sm font-bold"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-[#FFDE00] border-[4px] border-black shadow-[6px_6px_0px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] font-black uppercase text-lg tracking-wider transition-all"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 mx-auto animate-spin" />
              ) : (
                mode === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-12 space-y-4 text-center">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="text-[10px] font-black uppercase text-[#777] hover:text-black transition-colors underline decoration-[2px]"
            >
              {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-[#777]">
              <ArrowLeft className="w-3 h-3" />
              <button 
                onClick={onClose} 
                disabled={!canDismiss}
                className={!canDismiss ? 'opacity-30 cursor-not-allowed' : 'hover:text-black'}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
