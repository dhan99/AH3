'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  sub: string;
}

interface MockAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  loginWithRedirect: () => void;
  logout: (options?: { logoutParams: { returnTo: string } }) => void;
}

const MockAuthContext = createContext<MockAuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  loginWithRedirect: () => {},
  logout: () => {},
});

export const useMockAuth = () => useContext(MockAuthContext);

interface MockAuthProviderProps {
  children: ReactNode;
}

export const MockAuthProvider = ({ children }: MockAuthProviderProps) => {
  // For demonstration purposes, set the user as authenticated by default
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>({
    name: 'Demo Broker',
    email: 'broker@example.com',
    sub: 'mock|12345678',
  });

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const loginWithRedirect = useCallback(() => {
    setIsLoading(true);
    
    // Simulate a login delay
    setTimeout(() => {
      const mockUser = {
        name: 'Demo Broker',
        email: 'broker@example.com',
        sub: 'mock|12345678',
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }, 1000);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to home
    window.location.href = '/';
  }, []);

  return (
    <MockAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        loginWithRedirect,
        logout,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
};
