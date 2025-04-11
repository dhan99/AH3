'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import useStore from '@/store/useStore';

export default function CallbackPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth0();
  const { setAuthenticated, setUser } = useStore();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Update the global state
        setAuthenticated(true);
        setUser(user);
        
        // Redirect to the dashboard or home page
        router.push('/');
      } else {
        // If authentication failed, redirect to home
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, router, setAuthenticated, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Processing your login...</h1>
        <div className="w-16 h-16 border-4 border-[#007B87] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
