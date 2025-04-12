'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import useStore from '@/store/useStore';

import {
  Header,
  MainNavigation
} from '@/components/dashboard';

export default function SubmissionsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user: authUser } = useMockAuth();
  const { user, setUser, setAuthenticated } = useStore();
  
  // Sync auth user with store
  useEffect(() => {
    if (authUser && isAuthenticated) {
      setUser(authUser);
      setAuthenticated(true);
    }
  }, [authUser, isAuthenticated, setUser, setAuthenticated]);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
          <div className="w-16 h-16 border-4 border-[#007B87] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />
      
      {/* Main Navigation */}
      <MainNavigation activeTab="submissions" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-[#333333] mb-6">Submissions</h1>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[#F5F8FA] p-6 rounded-lg">
              <h2 className="text-lg font-medium text-[#007B87] mb-4">Recent Submissions</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  This page will display a list of all submissions, with filters for status, date range, and other criteria.
                </p>
                <p className="text-gray-600">
                  Users will be able to create new submissions, edit existing ones, and track their progress through the underwriting process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
