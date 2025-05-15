import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, AuthProvider as OAuthProvider } from '../types/auth';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOut as authSignOut,
  getCurrentSession
} from '../services/auth';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and makes auth available to all child components
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Get current session
        const { session: currentSession, error: sessionError } = await getCurrentSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        setError(err.message || 'Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with OAuth provider
  const signIn = async (provider: OAuthProvider) => {
    setLoading(true);
    setError(null);
    
    try {
      if (provider === 'email') {
        // Handle email sign-in separately
        return;
      }
      
      // Use Supabase directly for OAuth providers
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as 'google' | 'github' | 'facebook' | 'twitter',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
          queryParams: {
            // Make the consent screen more user-friendly
            prompt: 'select_account consent',
          },
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const handleSignInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        throw error;
      }
      
      // Update session and user state immediately
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      
      return { error: null };
    } catch (err: any) {
      console.error('Email sign in error:', err);
      setError(err.message || 'Failed to sign in with email');
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const handleSignUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await signUpWithEmail(email, password);
      
      if (error) {
        throw error;
      }
      
      // Update session and user state immediately
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      
      return { error: null };
    } catch (err: any) {
      console.error('Email sign up error:', err);
      setError(err.message || 'Failed to sign up with email');
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await authSignOut();
      
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  // Auth context value
  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
