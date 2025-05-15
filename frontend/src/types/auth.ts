import { Session, User } from '@supabase/supabase-js';

export type AuthUser = User;

export type AuthSession = Session;

export type AuthProvider = 'google' | 'github' | 'facebook' | 'twitter' | 'email';

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (provider: AuthProvider) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}
