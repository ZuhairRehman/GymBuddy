/**
 * Authentication Context Provider
 *
 * Provides authentication state management and methods for the application.
 * Features:
 * - Email/password authentication
 * - Session persistence using SecureStore
 * - Auto session refresh
 * - Loading state management
 *
 * @module AuthContext
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { AuthError, User, Session } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

/**
 * Authentication Context Interface
 * @interface AuthContextType
 * @property {User | null} user - Current authenticated user
 * @property {Session | null} session - Current authentication session
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {boolean} isLoading - Loading state for auth operations
 * @property {string | null} error - Error message for auth operations
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

// Create context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 *
 * Manages authentication state and provides auth methods to children
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<{
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    error: string | null;
  }>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    /**
     * Initialize authentication state from SecureStore
     * Sets up auth state listener for session management
     */
    const initializeAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        // Fetch session from SecureStore
        const storedSession = await SecureStore.getItemAsync('supabase-session');
        if (storedSession) {
          const session = JSON.parse(storedSession) as Session;
          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            error: null,
          });
          router.replace('/login'); // Redirect to login if no session
        }

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (currentSession) {
            await SecureStore.setItemAsync('supabase-session', JSON.stringify(currentSession));
            setAuthState({
              user: currentSession.user,
              session: currentSession,
              isLoading: false,
              error: null,
            });
          } else {
            await SecureStore.deleteItemAsync('supabase-session');
            setAuthState({
              user: null,
              session: null,
              isLoading: false,
              error: null,
            });
            router.replace('/login'); // Redirect to login on sign-out
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          error: 'Failed to initialize authentication.',
        });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Register a new user with email and password
   *
   * @async
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<{ error: AuthError | null }>} Result object with potential error
   */
  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: (error as AuthError).message }));
      return { error: error as AuthError };
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * Authenticate user with email and password
   *
   * @async
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<{ error: AuthError | null }>} Result object with potential error
   */
  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: (error as AuthError).message }));
      return { error: error as AuthError };
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * Sign out the current user
   * Clears session and user state
   *
   * @async
   * @returns {Promise<void>}
   */
  const signOut = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await supabase.auth.signOut();
      await SecureStore.deleteItemAsync('supabase-session');
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        error: null,
      });
      router.replace('/(auth)/login'); // Redirect to login on sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        session: authState.session,
        isAuthenticated: !!authState.session,
        isLoading: authState.isLoading,
        error: authState.error,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access auth context
 *
 * @throws {Error} If used outside of AuthProvider
 * @returns {AuthContextType} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
