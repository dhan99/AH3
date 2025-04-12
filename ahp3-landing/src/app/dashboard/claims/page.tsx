'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import useStore from '@/store/useStore';

import {
  Header,
  MainNavigation
} from '@/components/dashboard';

export default function ClaimsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user: authUser } = useMockAuth();
  const { user, setUser, setAuthenticated } = useStore();
  
  // Claims state
  const [activeTab, setActiveTab] = useState('active');
  
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

  // Mock claims data
  const activeClaims = [
    {
      id: 'CLM-2025-001',
      company: 'Very Good Trucking',
      claimant: 'John Smith',
      type: 'Occupational Accident',
      status: 'Investigation',
      dateOfLoss: '03/12/2025',
      reportedDate: '03/15/2025',
      reserveAmount: '$15,000',
    },
    {
      id: 'CLM-2025-002',
      company: 'Great Trucking',
      claimant: 'Robert Johnson',
      type: 'Vehicle Physical Damage',
      status: 'Pending Payment',
      dateOfLoss: '02/28/2025',
      reportedDate: '03/01/2025',
      reserveAmount: '$8,500',
    },
    {
      id: 'CLM-2025-003',
      company: 'Excellent Trucking',
      claimant: 'Maria Garcia',
      type: 'Non-Trucking Liability',
      status: 'Under Review',
      dateOfLoss: '03/20/2025',
      reportedDate: '03/21/2025',
      reserveAmount: '$12,000',
    },
  ];

  const historicalClaims = [
    {
      id: 'CLM-2024-089',
      company: 'Superior Trucking',
      claimant: 'David Lee',
      type: 'Occupational Accident',
      status: 'Closed - Paid',
      dateOfLoss: '11/15/2024',
      closedDate: '01/20/2025',
      paidAmount: '$7,250',
    },
    {
      id: 'CLM-2024-076',
      company: 'Very Good Trucking',
      claimant: 'Michael Brown',
      type: 'Non-Trucking Liability',
      status: 'Closed - Denied',
      dateOfLoss: '10/02/2024',
      closedDate: '12/05/2024',
      paidAmount: '$0',
    },
  ];

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
      <MainNavigation activeTab="claims" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-[#333333]">Claims</h1>
            
            <button 
              className="px-4 py-2 bg-[#007B87] text-white rounded-md hover:bg-[#005F6B] transition-colors"
              onClick={() => console.log('Submit new claim')}
            >
              Submit New Claim
            </button>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'active'
                    ? 'border-[#007B87] text-[#007B87]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('active')}
              >
                Active Claims
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'historical'
                    ? 'border-[#007B87] text-[#007B87]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('historical')}
              >
                Historical Claims
              </button>
            </nav>
          </div>
          
          {/* Active Claims Table */}
          {activeTab === 'active' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F5F8FA]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Loss</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserve</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeClaims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#007B87]">{claim.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.claimant}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.dateOfLoss}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.reserveAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-[#007B87] hover:text-[#005F6B] font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Historical Claims Table */}
          {activeTab === 'historical' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F5F8FA]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Loss</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closed Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historicalClaims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#007B87]">{claim.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.claimant}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          claim.status.includes('Paid') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.dateOfLoss}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.closedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.paidAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-[#007B87] hover:text-[#005F6B] font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
