'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import useStore from '@/store/useStore';

import {
  Header,
  MainNavigation
} from '@/components/dashboard';

export default function ReportingPage() {
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
      <MainNavigation activeTab="reporting" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-[#333333] mb-6">Reporting</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Premium by Line of Business */}
            <div className="bg-[#F5F8FA] p-6 rounded-lg">
              <h2 className="text-lg font-medium text-[#007B87] mb-4">Premium by Line of Business</h2>
              <div className="h-64 flex items-center justify-center border border-gray-200 bg-white rounded-md">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[#007B87] rounded-sm"></div>
                    <span className="text-sm text-gray-700">Occupational Accident: 45%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[#00A3B5] rounded-sm"></div>
                    <span className="text-sm text-gray-700">Non-Trucking Liability: 30%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[#6BD0DB] rounded-sm"></div>
                    <span className="text-sm text-gray-700">Vehicle Physical Damage: 25%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quote Conversion Rate */}
            <div className="bg-[#F5F8FA] p-6 rounded-lg">
              <h2 className="text-lg font-medium text-[#007B87] mb-4">Quote Conversion Rate</h2>
              <div className="h-64 flex items-center justify-center border border-gray-200 bg-white rounded-md">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#007B87]">68%</div>
                  <div className="text-sm text-gray-500 mt-2">Quote to Bound Conversion</div>
                  <div className="mt-4 text-sm text-green-600">↑ 5% from last quarter</div>
                </div>
              </div>
            </div>
            
            {/* Recent Submissions */}
            <div className="bg-[#F5F8FA] p-6 rounded-lg">
              <h2 className="text-lg font-medium text-[#007B87] mb-4">Submissions by Status</h2>
              <div className="h-64 flex items-center justify-center border border-gray-200 bg-white rounded-md">
                <div className="space-y-4 w-full px-6">
                  <div className="w-full">
                    <div className="flex justify-between text-sm">
                      <span>Drafted</span>
                      <span>12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-[#007B87] h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between text-sm">
                      <span>Quote Created</span>
                      <span>12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-[#007B87] h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between text-sm">
                      <span>Proposal Sent</span>
                      <span>12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-[#007B87] h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between text-sm">
                      <span>Quote Expiring</span>
                      <span>12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-[#007B87] h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between text-sm">
                      <span>Bound</span>
                      <span>12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-[#007B87] h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Year-to-Date Performance */}
            <div className="bg-[#F5F8FA] p-6 rounded-lg">
              <h2 className="text-lg font-medium text-[#007B87] mb-4">Year-to-Date Performance</h2>
              <div className="h-64 flex items-center justify-center border border-gray-200 bg-white rounded-md">
                <div className="grid grid-cols-2 gap-4 w-full p-4">
                  <div className="text-center p-4 rounded-md bg-gray-50">
                    <div className="text-3xl font-bold text-[#007B87]">32</div>
                    <div className="text-sm text-gray-500">Policies Bound</div>
                  </div>
                  <div className="text-center p-4 rounded-md bg-gray-50">
                    <div className="text-3xl font-bold text-[#007B87]">$425k</div>
                    <div className="text-sm text-gray-500">Premium Written</div>
                  </div>
                  <div className="text-center p-4 rounded-md bg-gray-50">
                    <div className="text-3xl font-bold text-[#007B87]">89%</div>
                    <div className="text-sm text-gray-500">Retention Rate</div>
                  </div>
                  <div className="text-center p-4 rounded-md bg-gray-50">
                    <div className="text-3xl font-bold text-[#007B87]">15</div>
                    <div className="text-sm text-gray-500">New Accounts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button className="px-4 py-2 bg-[#007B87] text-white rounded-md hover:bg-[#005F6B] transition-colors">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
