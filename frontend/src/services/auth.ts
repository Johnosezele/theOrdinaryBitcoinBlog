import { Provider } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { AuthProvider } from '../types/auth';

/**
 * Sign in with OAuth provider
 */
export const signInWithOAuth = async (provider: AuthProvider) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    return { data, error };
  } catch (error) {
    console.error('OAuth sign in error:', error);
    return { data: null, error };
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (data?.session) {
      // Force refresh the auth state
      await supabase.auth.refreshSession();
      
      // Log success for debugging
      console.log('Email sign in successful, session established');
    }
    
    return { data, error };
  } catch (error) {
    console.error('Email sign in error:', error);
    return { data: null, error };
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (data?.session) {
      // Force refresh the auth state
      await supabase.auth.refreshSession();
      
      // Log success for debugging
      console.log('Email sign up successful, session established');
    }
    
    return { data, error };
  } catch (error) {
    console.error('Email sign up error:', error);
    return { data: null, error };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};

/**
 * Get the current session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error };
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('Get user error:', error);
    return { user: null, error };
  }
};
