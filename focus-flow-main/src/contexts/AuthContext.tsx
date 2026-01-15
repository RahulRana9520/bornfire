import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, username: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithGithub: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  shouldShowSignInPrompt: () => boolean;
  dismissSignInPrompt: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstVisit, setFirstVisit] = useLocalStorage<string | null>('focusflow_first_visit', null);
  const [signInDismissed, setSignInDismissed] = useLocalStorage<boolean>('focusflow_signin_dismissed', false);

  useEffect(() => {
    // Track first visit
    if (!firstVisit) {
      setFirstVisit(new Date().toISOString());
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [firstVisit, setFirstVisit]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (!error && data.user) {
      // Create user profile in database
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        username,
        xp: 0,
        level: 1,
        league: 'bronze',
        streak: 0,
        longest_streak: 0,
      });
    }

    return { error };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error };
  }, []);

  const signInWithGithub = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const shouldShowSignInPrompt = useCallback(() => {
    if (user || signInDismissed || !firstVisit) return false;

    const firstVisitDate = new Date(firstVisit);
    const now = new Date();
    const daysSinceFirstVisit = Math.floor((now.getTime() - firstVisitDate.getTime()) / (1000 * 60 * 60 * 24));

    // Show prompt after 1-2 days (randomly between 1 and 2 days)
    return daysSinceFirstVisit >= 1;
  }, [user, signInDismissed, firstVisit]);

  const dismissSignInPrompt = useCallback(() => {
    setSignInDismissed(true);
  }, [setSignInDismissed]);

  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    shouldShowSignInPrompt,
    dismissSignInPrompt,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
