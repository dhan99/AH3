'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import { Breadcrumb, ProgressStepper } from '@/components/submission';

export default function ProposalPage() {
  const router = useRouter();
  const { isLoading, logout, user: authUser } = useMockAuth();
  
  // State for proposal options
  const [effectiveDate, setEffectiveDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [proposalName, setProposalName] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  
  // Define premium option type for type safety
  type PremiumOption = 'annual' | 'monthly';
  const [selectedPremiumOption, setSelectedPremiumOption] = useState<PremiumOption>('annual');
  
  // Navigation handlers
  const handlePreviousStep = () => {
    router.push('/submission/coverage-plan');
  };
  
  const handleCreateProposal = () => {
    // In a real app, this would send the proposal to the backend
    // and then navigate to a success page or dashboard
    router.push('/dashboard/submissions');
  };
  
  // Define steps for progress sidebar
  const steps = [
    {
      stepNumber: 1,
      title: 'Start New Submission',
      isActive: false,
      isCompleted: true,
      subsections: [
        { title: 'Motor Carrier', isActive: false, isCompleted: true },
        { title: 'Select Coverage', isActive: false, isCompleted: true }
      ]
    },
    {
      stepNumber: 2,
      title: 'Eligibility',
      isActive: false,
      isCompleted: true,
      subsections: [
        { title: 'Driver Agreements', isActive: false, isCompleted: true },
        { title: 'Vehicles', isActive: false, isCompleted: true },
        { title: 'Hauling', isActive: false, isCompleted: true },
        { title: 'Loss History', isActive: false, isCompleted: true }
      ]
    },
    {
      stepNumber: 3,
      title: 'Coverage and Plan Design',
      isActive: false,
      isCompleted: true
    },
    {
      stepNumber: 4,
      title: 'Confirm and Create Proposal',
      isActive: true,
      isCompleted: false
    }
  ];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'home', href: '/dashboard', isIcon: true },
    { label: 'New Submission', href: '/submission' },
    { label: 'Questionnaire', active: true }
  ];
  
  // Loading state
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

  // Calculate premium based on coverage selections
  // In a real app, these would be calculated from actual coverage selections
  const coveragePremiums = {
    occupationalAccident: {
      annual: 25200,
      monthly: 2100
    },
    nonTruckingLiability: {
      annual: 9600,
      monthly: 800
    },
    vehiclePhysicalDamage: {
      annual: 12000,
      monthly: 1000
    }
  } as const;  // Use const assertion to make TypeScript understand the literal object structure

  // Calculate total premium
  const calculateTotalPremium = () => {
    const occupationalAccident = coveragePremiums.occupationalAccident[selectedPremiumOption];
    const nonTruckingLiability = coveragePremiums.nonTruckingLiability[selectedPremiumOption];
    const vehiclePhysicalDamage = coveragePremiums.vehiclePhysicalDamage[selectedPremiumOption];
    
    return occupationalAccident + nonTruckingLiability + vehiclePhysicalDamage;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#F9F8FB]">
      {/* Header/Navbar */}
      <Header user={authUser || {}} onLogout={logout} />
      
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Main Content */}
      <div className="flex flex-row">
        {/* Left Sidebar - Progress Stepper */}
        <div className="min-w-[260px] shadow-sm bg-white">
          <ProgressStepper steps={steps} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8 bg-[#F9F8FB]">
          <h1 className="text-3xl font-bold text-[#333333] mb-6">Confirm and Create Proposal</h1>
          
          {/* MC Summary Block */}
          <div className="w-full bg-white rounded-lg border border-[#D8D8D8] shadow-md mb-6">
            <div className="w-full bg-[#F2FBFC] p-4 flex flex-row border-b border-[#D8D8D8] gap-8">
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-[#007B87]">Very Good Trucking Co.</h2>
                <p className="text-sm text-[#007B87]">DBA: Some Trucking Co. Doing Business As Name</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-[#007B87]">450 Rusty Rd<br />Atownin, Alabama 01234</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-[#007B87]">USDOT1523020</p>
              </div>
            </div>
          </div>
          
          {/* Proposal Details */}
          <div className="w-full bg-white border border-[#D8D8D8] rounded-lg mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#333333] mb-4">Proposal Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-base font-semibold text-[#333333] mb-2">Effective Date</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full p-3 border border-[#D8D8D8] rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-base font-semibold text-[#333333] mb-2">Expiration Date</label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full p-3 border border-[#D8D8D8] rounded"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-base font-semibold text-[#333333] mb-2">Proposal Name</label>
                <input
                  type="text"
                  value={proposalName}
                  onChange={(e) => setProposalName(e.target.value)}
                  placeholder="Enter proposal name"
                  className="w-full p-3 border border-[#D8D8D8] rounded"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-base font-semibold text-[#333333] mb-2">Proposal Description</label>
                <textarea
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  placeholder="Enter proposal description"
                  rows={4}
                  className="w-full p-3 border border-[#D8D8D8] rounded"
                />
              </div>
            </div>
          </div>
          
          {/* Coverage Summary */}
          <div className="w-full bg-white border border-[#D8D8D8] rounded-lg mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#333333]">Coverage Summary</h2>
                
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="premiumOption" 
                      value="annual" 
                      checked={selectedPremiumOption === 'annual'}
                      onChange={() => setSelectedPremiumOption('annual' as PremiumOption)}
                      className="w-4 h-4 mr-2 text-[#007B87] border-gray-300"
                    />
                    <span className="text-[#333333]">Annual</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="premiumOption" 
                      value="monthly"
                      checked={selectedPremiumOption === 'monthly'}
                      onChange={() => setSelectedPremiumOption('monthly' as PremiumOption)}
                      className="w-4 h-4 mr-2 text-[#007B87] border-gray-300"
                    />
                    <span className="text-[#333333]">Monthly</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border-b border-[#D8D8D8] pb-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-[#333333]">Occupational Accident</h3>
                      <p className="text-[#666666] text-sm">12 covered lives</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#333333]">
                        {formatCurrency(coveragePremiums.occupationalAccident[selectedPremiumOption])}
                      </p>
                      <p className="text-[#666666] text-sm">{selectedPremiumOption === 'annual' ? 'per year' : 'per month'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-[#D8D8D8] pb-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-[#333333]">Non-Trucking Liability</h3>
                      <p className="text-[#666666] text-sm">12 covered units</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#333333]">
                        {formatCurrency(coveragePremiums.nonTruckingLiability[selectedPremiumOption])}
                      </p>
                      <p className="text-[#666666] text-sm">{selectedPremiumOption === 'annual' ? 'per year' : 'per month'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-[#D8D8D8] pb-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-[#333333]">Vehicle Physical Damage</h3>
                      <p className="text-[#666666] text-sm">12 covered units</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#333333]">
                        {formatCurrency(coveragePremiums.vehiclePhysicalDamage[selectedPremiumOption])}
                      </p>
                      <p className="text-[#666666] text-sm">{selectedPremiumOption === 'annual' ? 'per year' : 'per month'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Total Premium */}
                <div className="pt-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-[#333333]">Total Premium</h3>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-[#333333]">
                        {formatCurrency(calculateTotalPremium())}
                      </p>
                      <p className="text-[#666666] text-sm">{selectedPremiumOption === 'annual' ? 'per year' : 'per month'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Button Bar - Full width spanning both sidebar and main content */}
      <div className="w-full flex justify-between py-4 px-6 bg-[#E6EEEF]">
        <button
          type="button"
          onClick={handlePreviousStep}
          className="border-2 border-[#007B87] text-[#007B87] font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#F2FBFC]"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="rotate-180"
          >
            <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
          </svg>
          Coverage and Plan Design
        </button>
        
        <button
          type="button"
          onClick={handleCreateProposal}
          className="bg-[#007B87] text-white font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#005F69]"
        >
          Create Proposal
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
