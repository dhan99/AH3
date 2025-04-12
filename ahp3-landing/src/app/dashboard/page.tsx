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
      <div className="w-full py-8 px-6">
        {/* Three-column layout with further adjusted widths */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Status Tabs and Activity Cards */}
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
          
          {/* Middle Column - Tasks List */}
          <div className="lg:col-span-4">
            {/* Tasks List */}
            <TaskList 
              tasks={tasks} 
              onTaskSelect={(index) => console.log(`Selected task ${index}`)} 
            />
            
            {/* Activity Feed */}
            <div className="mt-6">
              <h3 className="font-semibold text-[#333333] mb-2 text-lg text-center">Recent Activity</h3>
              <ActivityFeed activities={activities} />
            </div>
          </div>
          
          {/* Right Column - Action Buttons */}
          <div className="lg:col-span-2">
            {/* Action Buttons - Vertically stacked and right-aligned with proper spacing per Figma */}
            <div className="space-y-6 flex flex-col items-end">
              <ActionButton
                icon={
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M41.4262 50.4766H13.6035V17.0342H21.7688L22.6128 19.0219H32.3255L33.1688 17.0342H41.4262V33.1797L34.6659 39.9404L33.9728 45.8213L39.8552 45.1293L41.4262 43.5582V50.4766ZM27.628 13.8662C28.5272 13.8662 29.2558 14.5948 29.2558 15.494C29.2558 15.4997 29.2543 15.5055 29.2543 15.5108C29.2451 16.402 28.5215 17.1218 27.628 17.1218C26.7345 17.1218 26.0109 16.402 26.0017 15.5108C26.0017 15.5055 26.0002 15.4997 26.0002 15.494C26.0002 14.5948 26.7288 13.8662 27.628 13.8662ZM39.0881 43.5483L35.8676 43.9276L36.2473 40.7067L41.4262 35.527L42.1164 34.8372L42.9325 34.0207L42.9413 34.029L45.7742 36.8619L39.0881 43.5483ZM51.9262 33.0563L46.7374 27.8682L42.9497 31.6563V15.5108H34.9059L33.9027 12H21.351L20.3474 15.5108H12.0801V52H42.9497V42.0344L51.9262 33.0563ZM17.8323 25.6321H37.4211V24.1086H17.8323V25.6321ZM17.8323 30.9375H37.4211V29.414H17.8323V30.9375ZM17.8323 36.0879H37.4211V34.5644H17.8323V36.0879ZM17.9343 41.4314H29.5255V39.9079H17.9343V41.4314Z" fill="#007B87"/>
                  </svg>
                }
                label="Start Submission"
                onClick={() => router.push('/submission/coverage')}
              />
              
              <ActionButton
                icon={
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M27.1548 55.1214C26.2749 55.1214 25.5591 54.4031 25.5591 53.5195C25.5591 52.6317 26.2749 51.9175 27.1548 51.9175C28.0346 51.9175 28.7509 52.6317 28.7509 53.5195C28.7509 54.4031 28.0346 55.1214 27.1548 55.1214ZM27.1548 50.3721C25.422 50.3721 24.0197 51.7803 24.0197 53.5195C24.0197 55.2586 25.422 56.6668 27.1548 56.6668C28.8875 56.6668 30.2899 55.2586 30.2899 53.5195C30.2899 51.7803 28.8875 50.3721 27.1548 50.3721ZM51.1588 55.1214C50.2782 55.1214 49.5627 54.4031 49.5627 53.5195C49.5627 52.6317 50.2782 51.9175 51.1588 51.9175C52.0387 51.9175 52.7501 52.6317 52.7501 53.5195C52.7501 54.4031 52.0387 55.1214 51.1588 55.1214ZM51.1588 50.3721C49.4221 50.3721 48.0193 51.7803 48.0193 53.5195C48.0193 55.2586 49.4221 56.6668 51.1588 56.6668C52.8908 56.6668 54.2935 55.2586 54.2935 53.5195C54.2895 51.7803 52.8908 50.3721 51.1588 50.3721ZM33.7263 46.4418V42.7497L40.7123 42.6972C42.7015 42.6972 44.7518 43.4397 46.2225 44.7753L48.2205 46.462L33.7263 46.4418ZM32.6169 46.4418H24.9243L27.6771 44.1498C28.7382 43.246 29.8074 42.7497 31.1985 42.7497H32.6169V46.4418ZM23.2281 46.4418H20.39C19.5339 46.4418 18.8144 47.0349 18.6175 47.8339H6.9332V12.6316H15.5065L16.3912 14.7258H26.5762L27.4601 12.6316H36.2267L36.0459 41.636H31.0538C29.6667 41.636 28.3247 42.1283 27.2631 43.0281L23.2281 46.4418ZM19.9443 11.0095C19.9443 10.0693 20.7076 9.29859 21.6525 9.29859C22.589 9.29859 23.3607 10.0693 23.3607 11.0095C23.3607 11.0176 23.3563 11.0256 23.3563 11.0297C23.3487 11.9658 22.5846 12.7244 21.6525 12.7244C20.716 12.7244 19.9559 11.9658 19.9443 11.0297V11.0095ZM55.1861 47.2892L49.7635 46.4418L46.4078 43.5607C44.9564 42.3179 43.1155 41.636 41.2063 41.636H37.6411L37.8345 11.0297H29.2809L28.2318 7.3335H15.0684L14.0197 11.0297H5.3335V49.4358H18.5616V54.3667H22.9865C22.9343 54.0924 22.9021 53.8099 22.9021 53.5194C22.9021 51.1588 24.8077 49.2502 27.1546 49.2502C29.5019 49.2543 31.4035 51.1629 31.4071 53.5194C31.4071 53.8099 31.375 54.0924 31.3231 54.3667H46.9902C46.9383 54.0924 46.9062 53.8099 46.9062 53.5194C46.9062 51.1588 48.811 49.2502 51.1587 49.2502C53.506 49.2543 55.4067 51.1629 55.4067 53.5194C55.4067 53.8099 55.379 54.0924 55.3223 54.3667H58.6668V51.3727C58.6668 49.335 57.1917 47.6039 55.1861 47.2892ZM18.9151 35.6479L15.7961 36.0191L16.1618 32.8838L22.637 26.3833L25.3903 29.1473L18.9151 35.6479ZM26.3228 20.4032L14.6304 32.1414L13.9592 37.8591L19.6587 37.1852L31.3506 25.4471L26.3228 20.4032Z" fill="#007B87"/>
                  </svg>
                }
                label="Submit a Claim"
                onClick={() => console.log('Submit a claim')}
              />
              
              <ActionButton
                icon={
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M27.1548 55.1214C26.2749 55.1214 25.5591 54.4031 25.5591 53.5195C25.5591 52.6317 26.2749 51.9175 27.1548 51.9175C28.0346 51.9175 28.7509 52.6317 28.7509 53.5195C28.7509 54.4031 28.0346 55.1214 27.1548 55.1214ZM27.1548 50.3721C25.422 50.3721 24.0197 51.7803 24.0197 53.5195C24.0197 55.2586 25.422 56.6668 27.1548 56.6668C28.8875 56.6668 30.2899 55.2586 30.2899 53.5195C30.2899 51.7803 28.8875 50.3721 27.1548 50.3721ZM51.1588 55.1214C50.2782 55.1214 49.5627 54.4031 49.5627 53.5195C49.5627 52.6317 50.2782 51.9175 51.1588 51.9175C52.0387 51.9175 52.7501 52.6317 52.7501 53.5195C52.7501 54.4031 52.0387 55.1214 51.1588 55.1214ZM51.1588 50.3721C49.4221 50.3721 48.0193 51.7803 48.0193 53.5195C48.0193 55.2586 49.4221 56.6668 51.1588 56.6668C52.8908 56.6668 54.2935 55.2586 54.2935 53.5195C54.2895 51.7803 52.8908 50.3721 51.1588 50.3721ZM33.7263 46.4418V42.7497L40.7123 42.6972C42.7015 42.6972 44.7518 43.4397 46.2225 44.7753L48.2205 46.462L33.7263 46.4418ZM32.6169 46.4418H24.9243L27.6771 44.1498C28.7382 43.246 29.8074 42.7497 31.1985 42.7497H32.6169V46.4418ZM23.2281 46.4418H20.39C19.5339 46.4418 18.8144 47.0349 18.6175 47.8339H6.9332V12.6316H15.5065L16.3912 14.7258H26.5762L27.4601 12.6316H36.2267L36.0459 41.636H31.0538C29.6667 41.636 28.3247 42.1283 27.2631 43.0281L23.2281 46.4418ZM19.9443 11.0095C19.9443 10.0693 20.7076 9.29859 21.6525 9.29859C22.589 9.29859 23.3607 10.0693 23.3607 11.0095C23.3607 11.0176 23.3563 11.0256 23.3563 11.0297C23.3487 11.9658 22.5846 12.7244 21.6525 12.7244C20.716 12.7244 19.9559 11.9658 19.9443 11.0297V11.0095ZM55.1861 47.2892L49.7635 46.4418L46.4078 43.5607C44.9564 42.3179 43.1155 41.636 41.2063 41.636H37.6411L37.8345 11.0297H29.2809L28.2318 7.3335H15.0684L14.0197 11.0297H5.3335V49.4358H18.5616V54.3667H22.9865C22.9343 54.0924 22.9021 53.8099 22.9021 53.5194C22.9021 51.1588 24.8077 49.2502 27.1546 49.2502C29.5019 49.2543 31.4035 51.1629 31.4071 53.5194C31.4071 53.8099 31.375 54.0924 31.3231 54.3667H46.9902C46.9383 54.0924 46.9062 53.8099 46.9062 53.5194C46.9062 51.1588 48.811 49.2502 51.1587 49.2502C53.506 49.2543 55.4067 51.1629 55.4067 53.5194C55.4067 53.8099 55.379 54.0924 55.3223 54.3667H58.6668V51.3727C58.6668 49.335 57.1917 47.6039 55.1861 47.2892ZM18.9151 35.6479L15.7961 36.0191L16.1618 32.8838L22.637 26.3833L25.3903 29.1473L18.9151 35.6479ZM26.3228 20.4032L14.6304 32.1414L13.9592 37.8591L19.6587 37.1852L31.3506 25.4471L26.3228 20.4032Z" fill="#007B87"/>
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
