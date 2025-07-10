
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  userProfile: { full_name: string; email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user for offline presentation
const createMockUser = (email: string, fullName: string): User => ({
  id: 'mock-user-id',
  email: email,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  aud: 'authenticated',
  app_metadata: {},
  user_metadata: { full_name: fullName },
  identities: [],
  factors: []
});

const createMockSession = (user: User): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: user
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ full_name: string; email: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session in localStorage for offline mode
    const savedSession = localStorage.getItem('mock-session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        setSession(sessionData);
        setUser(sessionData.user);
        setUserProfile({
          full_name: sessionData.user.user_metadata.full_name || 'Demo User',
          email: sessionData.user.email
        });
      } catch (error) {
        console.error('Error parsing saved session:', error);
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Create mock user and session for offline presentation
    const mockUser = createMockUser(email, fullName);
    const mockSession = createMockSession(mockUser);
    
    // Save to localStorage for persistence
    localStorage.setItem('mock-session', JSON.stringify(mockSession));
    
    setSession(mockSession);
    setUser(mockUser);
    setUserProfile({
      full_name: fullName,
      email: email
    });

    toast({
      title: "Account created successfully",
      description: "Welcome to Digital Notebook!"
    });

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // For offline presentation, any credentials work
    // Use email as full name if no name is provided
    const fullName = email.split('@')[0] || 'Demo User';
    
    const mockUser = createMockUser(email, fullName);
    const mockSession = createMockSession(mockUser);
    
    // Save to localStorage for persistence
    localStorage.setItem('mock-session', JSON.stringify(mockSession));
    
    setSession(mockSession);
    setUser(mockUser);
    setUserProfile({
      full_name: fullName,
      email: email
    });

    toast({
      title: "Welcome back!",
      description: "Successfully signed in to Digital Notebook."
    });

    return { error: null };
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      // Clear localStorage
      localStorage.removeItem('mock-session');
      
      console.log('Successfully signed out');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred during logout.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      userProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
