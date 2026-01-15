import React, { useState } from 'react';
import { Mail, Github, Chrome, X, LogIn, UserPlus, Loader2, AlertCircle } from 'lucide-react';
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

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub } = useAuth();

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isSupabaseConfigured()) {
      setError('Authentication is not configured. Please set up Supabase credentials in .env file. See AUTHENTICATION_SETUP.md for instructions.');
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

  const handleGoogleSignIn = async () => {
    setError(null);
    
    if (!isSupabaseConfigured()) {
      setError('Authentication is not configured. Please set up Supabase credentials in .env file. See AUTHENTICATION_SETUP.md for instructions.');
      return;
    }
    
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      if (error.message.includes('Provider') || error.message.includes('not enabled')) {
        setError('Google sign-in is not enabled. Please enable Google OAuth in your Supabase dashboard (Authentication > Providers).');
      } else {
        setError(error.message);
      }
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    
    if (!isSupabaseConfigured()) {
      setError('Authentication is not configured. Please set up Supabase credentials in .env file. See AUTHENTICATION_SETUP.md for instructions.');
      return;
    }
    
    setLoading(true);
    const { error } = await signInWithGithub();
    if (error) {
      if (error.message.includes('Provider') || error.message.includes('not enabled')) {
        setError('GitHub sign-in is not enabled. Please enable GitHub OAuth in your Supabase dashboard (Authentication > Providers).');
      } else {
        setError(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-card rounded-2xl border border-border shadow-2xl p-6 sm:p-8 animate-scale-in">
          {/* Close button */}
          {canDismiss && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Configuration Warning */}
          {!isSupabaseConfigured() && (
            <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Authentication Not Configured</p>
                <p>Please set up Supabase credentials to enable sign-in. For now, you can continue as a guest with local storage.</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <img src="/app.png" alt="FocusFlow" className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {mode === 'signin' ? 'Welcome Back!' : 'Join FocusFlow'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {mode === 'signin'
                ? 'Sign in to sync your progress across devices'
                : 'Create an account to track your productivity'}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Social Sign In - Hidden until OAuth is configured */}
          {/* Uncomment when Google/GitHub OAuth is set up in Supabase
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading || !isSupabaseConfigured()}
              title={!isSupabaseConfigured() ? 'Configure Supabase to enable OAuth' : ''}
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGithubSignIn}
              disabled={loading || !isSupabaseConfigured()}
              title={!isSupabaseConfigured() ? 'Configure Supabase to enable OAuth' : ''}
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with email</span>
            </div>
          </div>
          */}

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {mode === 'signin' ? (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="text-primary font-semibold hover:underline"
              disabled={loading}
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          {/* Guest mode notice */}
          {canDismiss && (
            <div className="mt-4 p-3 rounded-lg bg-accent/50 text-xs text-muted-foreground text-center">
              You can continue as guest, but your data won't sync across devices
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
