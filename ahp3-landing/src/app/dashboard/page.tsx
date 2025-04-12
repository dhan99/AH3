'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import useStore from '@/store/useStore';
import Link from 'next/link';

import {
  Header,
  MainNavigation,
  StatusTabs,
  ActivityCard,
  TaskList,
  ActionButton,
  SearchInput,
  ActivityFeed
} from '@/components/dashboard';

export default function BrokerDashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user: authUser } = useMockAuth();
  const { user, setUser, setAuthenticated } = useStore();
  
  // Dashboard state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('drafted');
  
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

  // Status tab data
  const statusTabs = [
    { id: 'drafted', label: 'Drafted', count: 12 },
    { id: 'quoteCreated', label: 'Quote Created', count: 12 },
    { id: 'proposalSent', label: 'Proposal Sent', count: 12 },
    { id: 'quoteExpiring', label: 'Quote Expiring', count: 12 },
    { id: 'bound', label: 'Bound', count: 12 },
  ];

  // Mock activity cards data
  const activityCards = [
    {
      companyName: 'Very Good Trucking',
      status: 'Drafted',
      dotNumber: '1234567',
      mcNumber: 'MC987654',
      units: 5,
      drivers: 7,
      city: 'Chicago',
      state: 'IL',
      effectiveDate: '05/01/2025',
      products: {
        occupationalAccident: true,
        nonTruckingLiability: true,
        vehiclePhysicalDamage: false,
      },
    },
    {
      companyName: 'Great Trucking',
      status: 'Drafted',
      dotNumber: '7654321',
      mcNumber: 'MC123456',
      units: 12,
      drivers: 15,
      city: 'Dallas',
      state: 'TX',
      effectiveDate: '06/15/2025',
      products: {
        occupationalAccident: true,
        nonTruckingLiability: false,
        vehiclePhysicalDamage: true,
      },
    },
    {
      companyName: 'Excellent Trucking',
      status: 'Drafted',
      dotNumber: '9876543',
      mcNumber: 'MC456789',
      units: 8,
      drivers: 10,
      city: 'Atlanta',
      state: 'GA',
      effectiveDate: '07/01/2025',
      products: {
        occupationalAccident: true,
        nonTruckingLiability: true,
        vehiclePhysicalDamage: true,
      },
    },
    {
      companyName: 'Superior Trucking',
      status: 'Drafted',
      dotNumber: '3456789',
      mcNumber: 'MC654321',
      units: 15,
      drivers: 18,
      city: 'Denver',
      state: 'CO',
      effectiveDate: '05/15/2025',
      products: {
        occupationalAccident: false,
        nonTruckingLiability: true,
        vehiclePhysicalDamage: true,
      },
    },
  ];

  // Mock tasks data
  const tasks = [
    {
      company: 'Best Trucking, Inc.',
      taskType: 'Enrollment',
      description: '0 Enrollees - Plan a follow up',
      dueDate: '02/25/25',
    },
    {
      company: 'Good Guy Trucking, Inc.',
      taskType: 'Change Request',
      description: 'Request to update Questionnaire (and quote)',
      dueDate: '03/10/25',
    },
    {
      company: 'Best Trucking, Inc.',
      taskType: 'Enrollment',
      description: '0 Enrollees - Plan a follow up',
      dueDate: '02/25/25',
    },
    {
      company: 'Best Trucking, Inc.',
      taskType: 'Enrollment',
      description: '0 Enrollees - Plan a follow up',
      dueDate: '02/25/25',
    },
    {
      company: 'Best Trucking, Inc.',
      taskType: 'Enrollment',
      description: '0 Enrollees - Plan a follow up',
      dueDate: '02/25/25',
    },
  ];

  // Mock activity feed data
  const activities = [
    {
      id: '1',
      content: 'Very Good Trucking accepted a quote proposal.',
      secondaryContent: 'You\'ve bound another account! 🎉',
      timestamp: '1 hour ago',
    },
    {
      id: '2',
      content: 'Moderately Good Trucking accepted a quote proposal.',
      secondaryContent: 'You\'ve bound another account! 🎉',
      timestamp: '1 hour ago',
    },
    {
      id: '3',
      content: 'Great Trucking accepted a quote proposal.',
      secondaryContent: 'You\'ve bound another account! 🎉',
      timestamp: 'Yesterday',
    },
    {
      id: '4',
      content: 'ABCD Transport Solutions added 5 drivers.',
      timestamp: '01/15/25',
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
      <MainNavigation activeTab="dashboard" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Three-column layout with further adjusted widths */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Status Tabs and Activity Cards (reduced by 10% to 6/12 width) */}
          <div className="lg:col-span-6">
            {/* Status Tabs */}
            <StatusTabs 
              tabs={statusTabs} 
              activeTab={activeStatusTab} 
              onTabChange={setActiveStatusTab} 
            />
            
            {/* Search Input */}
            <div className="mt-6">
              <SearchInput 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="Search by company name, DOT number, etc." 
              />
            </div>
            
            {/* Activity Cards */}
            <div className="mt-6 space-y-6">
              {activityCards.map((card, index) => (
                <ActivityCard
                  key={index}
                  {...card}
                  onEdit={() => console.log(`Edit ${card.companyName}`)}
                />
              ))}
            </div>
          </div>
          
          {/* Middle Column - Tasks List (reduced to 4/12 width) */}
          <div className="lg:col-span-4">
            {/* Tasks List */}
            <TaskList 
              tasks={tasks} 
              onTaskSelect={(index) => console.log(`Selected task ${index}`)} 
            />
            
            {/* Activity Feed */}
            <div className="mt-6">
              <h3 className="font-semibold text-[#333333] mb-2">Recent Activity</h3>
              <ActivityFeed activities={activities} />
            </div>
          </div>
          
          {/* Right Column - Action Buttons (increased width to 2/12) */}
          <div className="lg:col-span-2">
            {/* Action Buttons - Vertically stacked and right-aligned */}
            <div className="space-y-4 flex flex-col items-end">
              <ActionButton
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" fill="currentColor"/>
                  </svg>
                }
                label="Start Submission"
                onClick={() => router.push('/submission/coverage')}
              />
              
              <ActionButton
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" fill="currentColor"/>
                  </svg>
                }
                label="Submit a Claim"
                onClick={() => console.log('Submit a claim')}
              />
              
              <ActionButton
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
                  </svg>
                }
                label="Create a Report"
                onClick={() => console.log('Create a report')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
