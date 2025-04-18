'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import { Breadcrumb, ProgressStepper } from '@/components/submission';

export default function CoveragePlanDriverPage() {
  const router = useRouter();
  const { isLoading, logout, user: authUser } = useMockAuth();
  
  // States for modal visibility
  const [showAllStatesModal, setShowAllStatesModal] = useState(false);
  const [currentDriverType, setCurrentDriverType] = useState<'ownerOperator' | 'contractDriver'>('ownerOperator');
  
  // List of all US states
  const allUSStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  // Function to get state options for dropdowns
  const getStateOptions = () => {
    return allUSStates.map(state => (
      <option key={state} value={state}>{state}</option>
    ));
  };

  // State for modal data
  const [allStatesData, setAllStatesData] = useState<Record<string, string>>({});
  
  // State for driver information
  const [ownerOperatorCount, setOwnerOperatorCount] = useState('14');
  const [ownerOperatorStates, setOwnerOperatorStates] = useState([
    { state: 'Rhode Island', drivers: '2' },
    { state: 'Massachusetts', drivers: '4' },
    { state: 'Connecticut', drivers: '6' },
    { state: 'Vermont', drivers: '2' }
  ]);
  
  const [contractDriverCount, setContractDriverCount] = useState('14');
  const [contractDriverStates, setContractDriverStates] = useState([
    { state: 'Rhode Island', drivers: '2' },
    { state: 'Massachusetts', drivers: '4' },
    { state: 'Connecticut', drivers: '6' },
    { state: 'Vermont', drivers: '2' }
  ]);

  // Reference for outside click detection
  const modalRef = useRef<HTMLDivElement>(null);
  
  // State for coverage options
  const [coverageOptions, setCoverageOptions] = useState({
    deathDismemberment: '$200,000',
    accidentMedical: '$500,000',
    disabilityBenefit: '$500 weekly maximum'
  });
  
  // State for accordion sections
  const [openSections, setOpenSections] = useState({
    driverTypes: true,
    coverageOptions: true
  });
  
  // Toggle accordion sections
  const toggleSection = (section: 'driverTypes' | 'coverageOptions') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle adding a new state for owner operators
  const addOwnerOperatorState = () => {
    setOwnerOperatorStates([
      ...ownerOperatorStates,
      { state: '', drivers: '' }
    ]);
  };
  
  // Handle removing a state for owner operators
  const removeOwnerOperatorState = (index: number) => {
    setOwnerOperatorStates(
      ownerOperatorStates.filter((_, i) => i !== index)
    );
  };
  
  // Handle adding a new state for contract drivers
  const addContractDriverState = () => {
    setContractDriverStates([
      ...contractDriverStates,
      { state: '', drivers: '' }
    ]);
  };
  
  // Handle removing a state for contract drivers
  const removeContractDriverState = (index: number) => {
    setContractDriverStates(
      contractDriverStates.filter((_, i) => i !== index)
    );
  };
  
  // Handle updating owner operator state information
  const updateOwnerOperatorState = (index: number, field: 'state' | 'drivers', value: string) => {
    const updatedStates = [...ownerOperatorStates];
    updatedStates[index] = {
      ...updatedStates[index],
      [field]: value
    };
    setOwnerOperatorStates(updatedStates);
  };
  
  // Handle updating contract driver state information
  const updateContractDriverState = (index: number, field: 'state' | 'drivers', value: string) => {
    const updatedStates = [...contractDriverStates];
    updatedStates[index] = {
      ...updatedStates[index],
      [field]: value
    };
    setContractDriverStates(updatedStates);
  };
  
  // Handle coverage option changes
  const updateCoverageOption = (option: keyof typeof coverageOptions, value: string) => {
    setCoverageOptions({
      ...coverageOptions,
      [option]: value
    });
  };
  
  // Navigation handlers
  const handlePreviousStep = () => {
    router.push('/submission/loss-history');
  };
  
  const handleNextStep = () => {
    router.push('/submission/coverage-plan-value');
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
      isCompleted: false,
      subsections: [
        { title: 'Occupational Accident', isActive: true, isCompleted: false },
        { title: 'NTL and VPD', isActive: false, isCompleted: false }
      ]
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
          <h1 className="text-3xl font-bold text-[#333333] mb-6">Coverage Plan and Design</h1>
          
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
          
          <h2 className="text-2xl font-semibold text-[#333333] mb-4">Occupational Accident</h2>
          
          {/* Driver Types Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('driverTypes')}
            >
              <h2 className="text-xl font-semibold text-[#333333] leading-[1.333em]">Driver Types</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.driverTypes ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.driverTypes && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                {/* Owner Operators Section */}
                <div className="mb-8">
                  <div className="mb-6">
                    <label className="block text-base font-semibold text-[#333333] mb-2">
                      How many Owner Operators?
                    </label>
                    <p className="text-sm text-[#333333] mb-2">
                      *Owner-Operator (OO) is an Independent Contractor (paid on a 1099) who owns/leases and drives the truck.
                    </p>
                    <input
                      type="number"
                      value={ownerOperatorCount}
                      onChange={(e) => setOwnerOperatorCount(e.target.value)}
                      className="w-64 p-3 border border-[#D8D8D8] rounded"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-base font-semibold text-[#333333] mb-4">
                      In which states do the Owner Operators reside?
                    </label>
                    
                    {ownerOperatorStates.map((stateData, index) => (
                      <div key={`oo-state-${index}`} className="flex items-end gap-4 mb-4">
                        <div className="w-full md:w-1/3">
                          <label className="block text-sm font-semibold text-[#333333] mb-1">State</label>
                          <select
                            value={stateData.state}
                            onChange={(e) => updateOwnerOperatorState(index, 'state', e.target.value)}
                            className="w-full p-3 border border-[#D8D8D8] rounded"
                          >
                            <option value="">Select a state</option>
                            {getStateOptions()}
                          </select>
                        </div>
                        
                        <div className="w-full md:w-1/3">
                          <label className="block text-sm font-semibold text-[#333333] mb-1">Number of Drivers</label>
                          <input
                            type="number"
                            value={stateData.drivers}
                            onChange={(e) => updateOwnerOperatorState(index, 'drivers', e.target.value)}
                            className="w-full p-3 border border-[#D8D8D8] rounded"
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeOwnerOperatorState(index)}
                          className="text-[#007B87] border border-[#007B87] px-4 py-2 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      type="button" 
                      onClick={addOwnerOperatorState}
                      className="flex items-center text-[#007B87] border border-[#007B87] px-4 py-2 rounded mt-2"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M6 0V12" stroke="#007B87" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M0 6H12" stroke="#007B87" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Add Another
                    </button>
                    
    <button
      type="button"
      className="block text-[#007B87] mt-4 hover:underline"
      onClick={() => {
        setCurrentDriverType('ownerOperator');
        // Pre-populate with existing data
        const initialData: Record<string, string> = {};
        ownerOperatorStates.forEach(state => {
          initialData[state.state] = state.drivers;
        });
        setAllStatesData(initialData);
        setShowAllStatesModal(true);
      }}
    >
      See all states at once
    </button>
                  </div>
                </div>
                
                {/* Contract Drivers Section */}
                <div>
                  <div className="mb-6">
                    <label className="block text-base font-semibold text-[#333333] mb-2">
                      How many Contract Drivers?
                    </label>
                    <p className="text-sm text-[#333333] mb-2">
                      Contract Driver (CD) is an Independent Contractor (paid on a 1099) who drives the truck of an Owner Operator.
                    </p>
                    <input
                      type="number"
                      value={contractDriverCount}
                      onChange={(e) => setContractDriverCount(e.target.value)}
                      className="w-64 p-3 border border-[#D8D8D8] rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-[#333333] mb-4">
                      In which states do the Contract Drivers reside?
                    </label>
                    
                    {contractDriverStates.map((stateData, index) => (
                      <div key={`cd-state-${index}`} className="flex items-end gap-4 mb-4">
                        <div className="w-full md:w-1/3">
                          <label className="block text-sm font-semibold text-[#333333] mb-1">State</label>
                          <select
                            value={stateData.state}
                            onChange={(e) => updateContractDriverState(index, 'state', e.target.value)}
                            className="w-full p-3 border border-[#D8D8D8] rounded"
                          >
                            <option value="">Select a state</option>
                            {getStateOptions()}
                          </select>
                        </div>
                        
                        <div className="w-full md:w-1/3">
                          <label className="block text-sm font-semibold text-[#333333] mb-1">Number of Drivers</label>
                          <input
                            type="number"
                            value={stateData.drivers}
                            onChange={(e) => updateContractDriverState(index, 'drivers', e.target.value)}
                            className="w-full p-3 border border-[#D8D8D8] rounded"
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeContractDriverState(index)}
                          className="text-[#007B87] border border-[#007B87] px-4 py-2 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      type="button" 
                      onClick={addContractDriverState}
                      className="flex items-center text-[#007B87] border border-[#007B87] px-4 py-2 rounded mt-2"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M6 0V12" stroke="#007B87" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M0 6H12" stroke="#007B87" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Add Another
                    </button>
                    
    <button
      type="button"
      className="block text-[#007B87] mt-4 hover:underline"
      onClick={() => {
        setCurrentDriverType('contractDriver');
        // Pre-populate with existing data
        const initialData: Record<string, string> = {};
        contractDriverStates.forEach(state => {
          initialData[state.state] = state.drivers;
        });
        setAllStatesData(initialData);
        setShowAllStatesModal(true);
      }}
    >
      See all states at once
    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Coverage Options Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('coverageOptions')}
            >
              <h2 className="text-xl font-semibold text-[#333333] leading-[1.333em]">Occupational Accident Coverage Options</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.coverageOptions ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.coverageOptions && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#333333] mb-4">
                    Accidental Death and Dismemberment Benefit Limit
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        coverageOptions.deathDismemberment === '$200,000' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => updateCoverageOption('deathDismemberment', '$200,000')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          coverageOptions.deathDismemberment === '$200,000' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {coverageOptions.deathDismemberment === '$200,000' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$200,000</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        coverageOptions.deathDismemberment === '$250,000' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => updateCoverageOption('deathDismemberment', '$250,000')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          coverageOptions.deathDismemberment === '$250,000' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {coverageOptions.deathDismemberment === '$250,000' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$250,000</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#333333] mb-4">
                    Accident Medical Benefit Limit
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        coverageOptions.accidentMedical === '$500,000' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => updateCoverageOption('accidentMedical', '$500,000')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          coverageOptions.accidentMedical === '$500,000' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {coverageOptions.accidentMedical === '$500,000' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$500,000</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        coverageOptions.accidentMedical === '$1,000,000' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => updateCoverageOption('accidentMedical', '$1,000,000')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          coverageOptions.accidentMedical === '$1,000,000' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {coverageOptions.accidentMedical === '$1,000,000' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$1,000,000</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#333333] mb-4">
                    Disability Benefit (TTD and CTD)
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        coverageOptions.disabilityBenefit === '$500 weekly maximum' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => updateCoverageOption('disabilityBenefit', '$500 weekly maximum')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          coverageOptions.disabilityBenefit === '$500 weekly maximum' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {coverageOptions.disabilityBenefit === '$500 weekly maximum' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$500 weekly maximum</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        coverageOptions.disabilityBenefit === '$600 weekly maximum' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => updateCoverageOption('disabilityBenefit', '$600 weekly maximum')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          coverageOptions.disabilityBenefit === '$600 weekly maximum' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {coverageOptions.disabilityBenefit === '$600 weekly maximum' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$600 weekly maximum</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* All States Modal */}
      {showAllStatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            ref={modalRef}
            className="bg-white rounded-md w-full max-w-4xl max-h-[90vh] overflow-auto relative"
          >
            {/* Close button */}
            <button 
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAllStatesModal(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18M6 18L18 6" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Modal content */}
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#333333]">Drivers by State</h2>
                <p className="text-base text-[#333333]">Indicate the number of drivers in each state.</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                {allUSStates.map(state => (
                  <div key={state} className="mb-4">
                    <label className="block text-sm font-semibold text-[#333333] mb-1">{state}</label>
                    <input
                      type="number"
                      value={allStatesData[state] || ''}
                      onChange={(e) => {
                        setAllStatesData(prev => ({
                          ...prev,
                          [state]: e.target.value
                        }));
                      }}
                      className="w-full p-3 border border-[#D8D8D8] rounded"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="bg-[#007B87] text-white font-semibold px-6 py-2 rounded hover:bg-[#005F69]"
                  onClick={() => {
                    // Convert the data back to state array format
                    const updatedStates = Object.entries(allStatesData)
                      .filter(([_, value]) => value !== '')
                      .map(([state, drivers]) => ({ state, drivers }));
                    
                    if (currentDriverType === 'ownerOperator') {
                      setOwnerOperatorStates(updatedStates);
                    } else {
                      setContractDriverStates(updatedStates);
                    }
                    setShowAllStatesModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
          Eligibility
        </button>
        
        <button
          type="button"
          onClick={handleNextStep}
          className="bg-[#007B87] text-white font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#005F69]"
        >
          Coverage and Plan Design
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
