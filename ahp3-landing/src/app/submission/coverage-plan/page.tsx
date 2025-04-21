'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import { Breadcrumb, ProgressStepper } from '@/components/submission';
import Button from '@/components/ui/Button';

export default function CoveragePlanPage() {
  const router = useRouter();
  const { isLoading, logout, user: authUser } = useMockAuth();
  
  // Define sections and their open/closed state
  const [openSections, setOpenSections] = useState({
    occupationalAccident: true,
    nonTruckingLiability: true,
    vehiclePhysicalDamage: true
  });
  
  // State for coverage options
  const [occupationalAccidentOptions, setOccupationalAccidentOptions] = useState({
    plan: 'standard',
    accidentalDeath: '1000000',
    accidentalDismemberment: '1000000',
    temporaryTotalDisability: '500', // Weekly benefit
    continuousTotalDisability: '500', // Weekly benefit
    medicalExpense: '100000',
    passengerAccidentalDeath: '50000',
    eliminationPeriod: '7', // Days
    maxBenefitPeriod: '104', // Weeks
    passengerMedicalExpense: '5000'
  });
  
  const [nonTruckingLiabilityOptions, setNonTruckingLiabilityOptions] = useState({
    liability: '1000000'
  });
  
  const [vehiclePhysicalDamageOptions, setVehiclePhysicalDamageOptions] = useState({
    deductible: '1000',
    comprehensiveDeductible: '1000'
  });
  
  // Function to toggle accordion sections
  const toggleSection = (section: 'occupationalAccident' | 'nonTruckingLiability' | 'vehiclePhysicalDamage') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Update occupational accident options
  const handleOccupationalAccidentChange = (field: keyof typeof occupationalAccidentOptions, value: string) => {
    setOccupationalAccidentOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Update non-trucking liability options
  const handleNonTruckingLiabilityChange = (field: keyof typeof nonTruckingLiabilityOptions, value: string) => {
    setNonTruckingLiabilityOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Update vehicle physical damage options
  const handleVehiclePhysicalDamageChange = (field: keyof typeof vehiclePhysicalDamageOptions, value: string) => {
    setVehiclePhysicalDamageOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Navigation handlers
  const handlePreviousStep = () => {
    router.push('/submission/loss-history');
  };
  
  const handleNextStep = () => {
    // Add validation here if needed
    router.push('/submission/proposal');
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
      isActive: true,
      isCompleted: false
    },
    {
      stepNumber: 4,
      title: 'Confirm and Create Proposal',
      isActive: false,
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
          <h1 className="text-3xl font-bold text-[#333333] mb-6">Coverage and Plan Design</h1>
          
          {/* MC Summary Block */}
          <div className="w-full bg-white rounded-lg border border-[#D8D8D8] shadow-md mb-6">
            <div className="w-full bg-[#F2FBFC] p-4 flex flex-row border-b border-[#D8D8D8] justify-center">
              <div className="flex flex-col flex-1">
                <h2 className="text-base font-semibold text-[#007B87]">Very Good Trucking Co.</h2>
                <p className="text-sm text-[#007B87]">DBA: Some Trucking Co. Doing Business As Name</p>
              </div>
              <div className="flex flex-col flex-1 items-center">
                <p className="text-sm text-[#007B87] whitespace-pre-line">450 Rusty Rd<br />Atownin, Alabama 01234</p>
              </div>
              <div className="flex flex-col flex-1 items-end">
                <p className="text-sm text-[#007B87]">USDOT1523020</p>
              </div>
            </div>
          </div>
          
          {/* Occupational Accident Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('occupationalAccident')}
            >
              <h2 className="text-2xl font-semibold text-[#333333] leading-[1.333em]">Occupational Accident</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.occupationalAccident ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.occupationalAccident && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                <div className="mb-6">
                  <div className="flex flex-col mb-4">
                    <label className="text-base font-semibold text-[#333333] mb-2">Plan Type</label>
                    <select
                      value={occupationalAccidentOptions.plan}
                      onChange={(e) => handleOccupationalAccidentChange('plan', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="standard">Standard Plan</option>
                      <option value="enhanced">Enhanced Plan</option>
                      <option value="premium">Premium Plan</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Accidental Death Benefit</label>
                    <select
                      value={occupationalAccidentOptions.accidentalDeath}
                      onChange={(e) => handleOccupationalAccidentChange('accidentalDeath', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="500000">$500,000</option>
                      <option value="750000">$750,000</option>
                      <option value="1000000">$1,000,000</option>
                      <option value="1500000">$1,500,000</option>
                      <option value="2000000">$2,000,000</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Accidental Dismemberment Benefit</label>
                    <select
                      value={occupationalAccidentOptions.accidentalDismemberment}
                      onChange={(e) => handleOccupationalAccidentChange('accidentalDismemberment', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="500000">$500,000</option>
                      <option value="750000">$750,000</option>
                      <option value="1000000">$1,000,000</option>
                      <option value="1500000">$1,500,000</option>
                      <option value="2000000">$2,000,000</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Temporary Total Disability</label>
                    <select
                      value={occupationalAccidentOptions.temporaryTotalDisability}
                      onChange={(e) => handleOccupationalAccidentChange('temporaryTotalDisability', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="400">$400/week</option>
                      <option value="500">$500/week</option>
                      <option value="600">$600/week</option>
                      <option value="700">$700/week</option>
                      <option value="800">$800/week</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Continuous Total Disability</label>
                    <select
                      value={occupationalAccidentOptions.continuousTotalDisability}
                      onChange={(e) => handleOccupationalAccidentChange('continuousTotalDisability', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="400">$400/week</option>
                      <option value="500">$500/week</option>
                      <option value="600">$600/week</option>
                      <option value="700">$700/week</option>
                      <option value="800">$800/week</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Medical Expense Benefit</label>
                    <select
                      value={occupationalAccidentOptions.medicalExpense}
                      onChange={(e) => handleOccupationalAccidentChange('medicalExpense', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="50000">$50,000</option>
                      <option value="100000">$100,000</option>
                      <option value="250000">$250,000</option>
                      <option value="500000">$500,000</option>
                      <option value="1000000">$1,000,000</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Passenger Accidental Death</label>
                    <select
                      value={occupationalAccidentOptions.passengerAccidentalDeath}
                      onChange={(e) => handleOccupationalAccidentChange('passengerAccidentalDeath', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="25000">$25,000</option>
                      <option value="50000">$50,000</option>
                      <option value="75000">$75,000</option>
                      <option value="100000">$100,000</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Elimination Period (Days)</label>
                    <select
                      value={occupationalAccidentOptions.eliminationPeriod}
                      onChange={(e) => handleOccupationalAccidentChange('eliminationPeriod', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="7">7 Days</option>
                      <option value="14">14 Days</option>
                      <option value="30">30 Days</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Maximum Benefit Period (Weeks)</label>
                    <select
                      value={occupationalAccidentOptions.maxBenefitPeriod}
                      onChange={(e) => handleOccupationalAccidentChange('maxBenefitPeriod', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="52">52 Weeks</option>
                      <option value="104">104 Weeks</option>
                      <option value="156">156 Weeks</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Passenger Medical Expense</label>
                    <select
                      value={occupationalAccidentOptions.passengerMedicalExpense}
                      onChange={(e) => handleOccupationalAccidentChange('passengerMedicalExpense', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="5000">$5,000</option>
                      <option value="10000">$10,000</option>
                      <option value="15000">$15,000</option>
                      <option value="20000">$20,000</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Non-Trucking Liability Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('nonTruckingLiability')}
            >
              <h2 className="text-2xl font-semibold text-[#333333] leading-[1.333em]">Non-Trucking Liability</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.nonTruckingLiability ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.nonTruckingLiability && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                <div className="mb-6">
                  <div className="flex flex-col mb-4">
                    <label className="text-base font-semibold text-[#333333] mb-2">Liability Limit</label>
                    <select
                      value={nonTruckingLiabilityOptions.liability}
                      onChange={(e) => handleNonTruckingLiabilityChange('liability', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="500000">$500,000</option>
                      <option value="750000">$750,000</option>
                      <option value="1000000">$1,000,000</option>
                      <option value="2000000">$2,000,000</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Vehicle Physical Damage Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('vehiclePhysicalDamage')}
            >
              <h2 className="text-2xl font-semibold text-[#333333] leading-[1.333em]">Vehicle Physical Damage</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.vehiclePhysicalDamage ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.vehiclePhysicalDamage && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Collision Deductible</label>
                    <select
                      value={vehiclePhysicalDamageOptions.deductible}
                      onChange={(e) => handleVehiclePhysicalDamageChange('deductible', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="500">$500</option>
                      <option value="1000">$1,000</option>
                      <option value="2500">$2,500</option>
                      <option value="5000">$5,000</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-base font-semibold text-[#333333] mb-2">Comprehensive Deductible</label>
                    <select
                      value={vehiclePhysicalDamageOptions.comprehensiveDeductible}
                      onChange={(e) => handleVehiclePhysicalDamageChange('comprehensiveDeductible', e.target.value)}
                      className="border border-[#D8D8D8] rounded p-2"
                    >
                      <option value="500">$500</option>
                      <option value="1000">$1,000</option>
                      <option value="2500">$2,500</option>
                      <option value="5000">$5,000</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Button Bar - Full width spanning both sidebar and main content */}
      <div className="w-full flex justify-between py-4 px-6 bg-[#E6EEEF]">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          iconLeft={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6808 19C14.3791 19 14.0787 18.8779 13.8593 18.6374L8.49001 12.7486C8.10335 12.3244 8.10335 11.6756 8.49001 11.2514L13.8593 5.36256C14.2728 4.90911 14.9757 4.87656 15.429 5.29C15.8825 5.70356 15.9149 6.40622 15.5016 6.85967L10.8147 12L15.5016 17.1403C15.9149 17.5938 15.8825 18.2964 15.429 18.71C15.216 18.9042 14.9479 19 14.6808 19Z" fill="#007B87"/>
            </svg>
          }
          >
          Loss History
        </Button>
        
        <Button
          type="button"
          onClick={handleNextStep}
          iconRight={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.51922 5C9.82089 5 10.1213 5.12211 10.3407 5.36256L15.71 11.2514C16.0967 11.6756 16.0967 12.3244 15.71 12.7486L10.3407 18.6374C9.92722 19.0909 9.22433 19.1234 8.771 18.71C8.31756 18.2964 8.28511 17.5938 8.69845 17.1403L13.3853 12L8.69845 6.85967C8.28511 6.40622 8.31756 5.70356 8.771 5.29C8.984 5.09578 9.25211 5 9.51922 5Z" fill="white"/>
            </svg>
          }
          className="bg-[#007B87] text-white font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#005F69] mr-6"
          >
          Proposal
        </Button>
      </div>
    </div>
  );
}
