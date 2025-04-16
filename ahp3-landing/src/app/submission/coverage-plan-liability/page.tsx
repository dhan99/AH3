'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import { Breadcrumb, ProgressStepper } from '@/components/submission';

export default function CoveragePlanLiabilityPage() {
  const router = useRouter();
  const { isLoading, logout, user: authUser } = useMockAuth();
  
  // State for accordion sections
  const [openSections, setOpenSections] = useState({
    unitsByState: true,
    coverageOptions: true,
    tivForVpd: true,
    vpdCoverageOptions: true,
    effectiveDates: true
  });
  
  // State for units by state
  const [unitsByState, setUnitsByState] = useState([
    { state: 'Rhode Island', units: '2' },
    { state: 'Massachusetts', units: '4' },
    { state: 'Connecticut', units: '6' },
    { state: 'Vermont', units: '2' }
  ]);
  
  // State for coverage options
  const [combinedSingleLimit, setCombinedSingleLimit] = useState('$500,000');
  
  // State for VPD options
  const [vpdDeductible, setVpdDeductible] = useState('$500');
  
  // State for TIV
  const [powerUnits, setPowerUnits] = useState({ units: '7', tiv: '$61,728' });
  const [trailers, setTrailers] = useState({ units: '7', tiv: '$61,728' });
  
  // State for effective dates
  const [sameEffectiveDateForAll, setSameEffectiveDateForAll] = useState(false);
  const [effectiveDates, setEffectiveDates] = useState({
    occupationalAccident: 'mm/dd/yyyy',
    nonTruckingLiability: 'mm/dd/yyyy',
    vehiclePhysicalDamage: 'mm/dd/yyyy'
  });
  
  // Toggle accordion sections
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle adding a new state for units
  const addUnitState = () => {
    setUnitsByState([...unitsByState, { state: '', units: '' }]);
  };
  
  // Handle updating units by state
  const updateUnitsByState = (index: number, field: 'state' | 'units', value: string) => {
    const updatedStates = [...unitsByState];
    updatedStates[index] = { ...updatedStates[index], [field]: value };
    setUnitsByState(updatedStates);
  };
  
  // Calculate totals for TIV section
  const calculateTotals = () => {
    const totalUnits = parseInt(powerUnits.units) + parseInt(trailers.units);
    return {
      totalUnits,
      totalTiv: '$123,456' // This would typically be calculated from actual values
    };
  };
  
  // Navigation handlers
  const handlePreviousStep = () => router.push('/submission/coverage-plan-value');
  const handleNextStep = () => router.push('/submission/proposal');
  
  // Progress steps
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
        { title: 'Occupational Accident', isActive: false, isCompleted: true },
        { title: 'NTL and VPD', isActive: true, isCompleted: false }
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
    { label: 'Create a Quote', href: '/submission' },
    { label: 'Questionnaire', active: true }
  ];
  
  // Totals for display
  const { totalUnits, totalTiv } = calculateTotals();
  
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
          
          <h2 className="text-2xl font-semibold text-[#333333] mb-4">Non-Trucking Liability</h2>
          
          {/* Units by State Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-4 bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('unitsByState')}
            >
              <h3 className="text-xl font-semibold text-[#333333]">Units by State</h3>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.unitsByState ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.unitsByState && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#333333] mb-4">
                    Where are the units registered?
                  </label>
                  
                  {unitsByState.map((unit, index) => (
                    <div key={`unit-state-${index}`} className="flex items-end gap-4 mb-4">
                      <div className="w-1/3">
                        <label className="block text-base font-semibold text-[#333333] mb-1">
                          State<span className="text-[#C60C30]">*</span>
                        </label>
                        <select
                          value={unit.state}
                          onChange={(e) => updateUnitsByState(index, 'state', e.target.value)}
                          className="w-full p-3 border border-[#D8D8D8] rounded"
                        >
                          <option value="">Select a state</option>
                          <option value="Alabama">Alabama</option>
                          <option value="Alaska">Alaska</option>
                          <option value="Arizona">Arizona</option>
                          <option value="Arkansas">Arkansas</option>
                          <option value="California">California</option>
                          <option value="Colorado">Colorado</option>
                          <option value="Connecticut">Connecticut</option>
                          <option value="Delaware">Delaware</option>
                          <option value="Florida">Florida</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Hawaii">Hawaii</option>
                          <option value="Idaho">Idaho</option>
                          <option value="Illinois">Illinois</option>
                          <option value="Indiana">Indiana</option>
                          <option value="Iowa">Iowa</option>
                          <option value="Kansas">Kansas</option>
                          <option value="Kentucky">Kentucky</option>
                          <option value="Louisiana">Louisiana</option>
                          <option value="Maine">Maine</option>
                          <option value="Maryland">Maryland</option>
                          <option value="Massachusetts">Massachusetts</option>
                          <option value="Michigan">Michigan</option>
                          <option value="Minnesota">Minnesota</option>
                          <option value="Mississippi">Mississippi</option>
                          <option value="Missouri">Missouri</option>
                          <option value="Montana">Montana</option>
                          <option value="Nebraska">Nebraska</option>
                          <option value="Nevada">Nevada</option>
                          <option value="New Hampshire">New Hampshire</option>
                          <option value="New Jersey">New Jersey</option>
                          <option value="New Mexico">New Mexico</option>
                          <option value="New York">New York</option>
                          <option value="North Carolina">North Carolina</option>
                          <option value="North Dakota">North Dakota</option>
                          <option value="Ohio">Ohio</option>
                          <option value="Oklahoma">Oklahoma</option>
                          <option value="Oregon">Oregon</option>
                          <option value="Pennsylvania">Pennsylvania</option>
                          <option value="Rhode Island">Rhode Island</option>
                          <option value="South Carolina">South Carolina</option>
                          <option value="South Dakota">South Dakota</option>
                          <option value="Tennessee">Tennessee</option>
                          <option value="Texas">Texas</option>
                          <option value="Utah">Utah</option>
                          <option value="Vermont">Vermont</option>
                          <option value="Virginia">Virginia</option>
                          <option value="Washington">Washington</option>
                          <option value="West Virginia">West Virginia</option>
                          <option value="Wisconsin">Wisconsin</option>
                          <option value="Wyoming">Wyoming</option>
                        </select>
                      </div>
                      
                      <div className="w-1/3">
                        <label className="block text-base font-semibold text-[#333333] mb-1">
                          Number of units<span className="text-[#C60C30]">*</span>
                        </label>
                        <input
                          type="number"
                          value={unit.units}
                          onChange={(e) => updateUnitsByState(index, 'units', e.target.value)}
                          className="w-full p-3 border border-[#D8D8D8] rounded"
                        />
                      </div>
                      
                      <button
                        type="button"
                        className="flex items-center justify-center text-[#007B87] border border-[#007B87] h-10 px-6 py-2 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    onClick={addUnitState}
                    className="flex items-center gap-2 text-[#007B87] border border-[#007B87] px-4 py-2 rounded mt-2"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 0V12" stroke="#007B87" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M0 6H12" stroke="#007B87" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Add Another
                  </button>
                  
                  <button
                    type="button"
                    className="block text-[#007B87] mt-4 hover:underline"
                  >
                    See all states at once
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Coverage Options Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-4 bg-[#D9F4F5] border border-[#D8D8D8] border-b-0 w-full"
              onClick={() => toggleSection('coverageOptions')}
            >
              <h3 className="text-xl font-semibold text-[#333333]">Coverage Options</h3>
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
                    Combined Single Limit (CSL)
                  </label>
                  
                  <div className="flex flex-wrap gap-4">
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        combinedSingleLimit === '$500,000' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => setCombinedSingleLimit('$500,000')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          combinedSingleLimit === '$500,000' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {combinedSingleLimit === '$500,000' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$500,000</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        combinedSingleLimit === '$1,000,000' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => setCombinedSingleLimit('$1,000,000')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          combinedSingleLimit === '$1,000,000' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {combinedSingleLimit === '$1,000,000' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$1,000,000</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="font-semibold text-base text-[#333333]">
                  Includes statutory minimum UM/UIM and PIP
                </div>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-semibold text-[#333333] mb-4">Vehicle Physical Damage</h2>
          
          {/* TIV Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-4 bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('tivForVpd')}
            >
              <h3 className="text-xl font-semibold text-[#333333]">Total Insured Value (TIV)</h3>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.tivForVpd ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.tivForVpd && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                {/* Power Units */}
                <div className="mb-4">
                  <div className="bg-[#F2FBFC] p-3 mb-4">
                    <h4 className="font-semibold text-[#333333]">Power Units</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    <div className="w-full md:w-1/4">
                      <label className="block text-sm font-semibold text-[#333333] mb-1">
                        Number of Units
                      </label>
                      <input
                        type="number"
                        value={powerUnits.units}
                        onChange={(e) => setPowerUnits({...powerUnits, units: e.target.value})}
                        className="w-full p-3 border border-[#D8D8D8] rounded text-right"
                      />
                    </div>
                    
                    <div className="w-full md:w-1/4">
                      <label className="block text-sm font-semibold text-[#333333] mb-1">
                        TIV
                      </label>
                      <input
                        type="text"
                        value={powerUnits.tiv}
                        onChange={(e) => setPowerUnits({...powerUnits, tiv: e.target.value})}
                        className="w-full p-3 border border-[#D8D8D8] rounded text-right"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Trailers */}
                <div className="mb-4">
                  <div className="bg-[#F2FBFC] p-3 mb-4">
                    <h4 className="font-semibold text-[#333333]">Trailers</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    <div className="w-full md:w-1/4">
                      <label className="block text-sm font-semibold text-[#333333] mb-1">
                        Number of Units
                      </label>
                      <input
                        type="number"
                        value={trailers.units}
                        onChange={(e) => setTrailers({...trailers, units: e.target.value})}
                        className="w-full p-3 border border-[#D8D8D8] rounded text-right"
                      />
                    </div>
                    
                    <div className="w-full md:w-1/4">
                      <label className="block text-sm font-semibold text-[#333333] mb-1">
                        TIV
                      </label>
                      <input
                        type="text"
                        value={trailers.tiv}
                        onChange={(e) => setTrailers({...trailers, tiv: e.target.value})}
                        className="w-full p-3 border border-[#D8D8D8] rounded text-right"
                      />
                    </div>
                  </div>
                </div>
                
                <hr className="my-4 border-[#D8D8D8]" />
                
                {/* Totals */}
                <div className="bg-[#E6EEEF] p-4 rounded">
                  <div className="flex flex-col items-center mb-2">
                    <span className="text-base text-[#333333]">Total power units and trailers</span>
                    <span className="font-semibold text-lg text-[#333333]">{totalUnits}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-base text-[#333333]">Total insured value</span>
                    <span className="font-semibold text-lg text-[#333333]">{totalTiv}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* VPD Coverage Options Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-4 bg-[#D9F4F5] border border-[#D8D8D8] border-b-0 w-full"
              onClick={() => toggleSection('vpdCoverageOptions')}
            >
              <h3 className="text-xl font-semibold text-[#333333]">VPD Coverage Options</h3>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.vpdCoverageOptions ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.vpdCoverageOptions && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                <div className="mb-6">
                  <label className="block text-base font-semibold text-[#333333] mb-4">
                    Deductible
                  </label>
                  
                  <div className="flex flex-wrap gap-4">
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        vpdDeductible === '$500' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => setVpdDeductible('$500')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          vpdDeductible === '$500' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {vpdDeductible === '$500' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$500</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        vpdDeductible === '$1,000' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => setVpdDeductible('$1,000')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          vpdDeductible === '$1,000' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {vpdDeductible === '$1,000' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$1,000</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        vpdDeductible === '$2,500' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => setVpdDeductible('$2,500')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          vpdDeductible === '$2,500' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {vpdDeductible === '$2,500' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$2,500</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`relative px-6 py-3 border rounded-sm cursor-pointer ${
                        vpdDeductible === '$5,000' 
                          ? 'bg-[#F2FBFC] border-[#007B87]' 
                          : 'bg-white border-[#D8D8D8]'
                      }`}
                      onClick={() => setVpdDeductible('$5,000')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          vpdDeductible === '$5,000' 
                            ? 'border-[#007B87]' 
                            : 'border-[#757575]'
                        }`}>
                          {vpdDeductible === '$5,000' && (
                            <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>
                          )}
                        </div>
                        <span className="text-[#333333]">$5,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Effective Dates Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-4 bg-[#D9F4F5] border border-[#D8D8D8] border-b-0 w-full"
              onClick={() => toggleSection('effectiveDates')}
            >
              <h3 className="text-xl font-semibold text-[#333333]">Effective dates</h3>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.effectiveDates ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.effectiveDates && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={sameEffectiveDateForAll}
                      onChange={(e) => setSameEffectiveDateForAll(e.target.checked)}
                      className="h-4 w-4 text-[#007B87] rounded border-[#757575]"
                    />
                    <span className="text-[#333333]">Same effective date for all</span>
                  </label>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <label className="block text-base font-semibold text-[#333333] mb-1">
                        Occupational Accident requested effective date
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={effectiveDates.occupationalAccident}
                          onChange={(e) => setEffectiveDates({...effectiveDates, occupationalAccident: e.target.value})}
                          disabled={sameEffectiveDateForAll}
                          className="w-full p-3 border border-[#D8D8D8] rounded pr-10"
                          placeholder="mm/dd/yyyy"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2H13.3333C13.7754 2 14.1993 2.17559 14.5118 2.48816C14.8244 2.80072 15 3.22464 15 3.66667V13.6667C15 14.1087 14.8244 14.5326 14.5118 14.8452C14.1993 15.1577 13.7754 15.3333 13.3333 15.3333H2.66667C2.22464 15.3333 1.80072 15.1577 1.48816 14.8452C1.17559 14.5326 1 14.1087 1 13.6667V3.66667C1 3.22464 1.17559 2.80072 1.48816 2.48816C1.80072 2.17559 2.22464 2 2.66667 2H4" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.33333 1.33334V2.66667" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.6667 1.33334V2.66667" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4.66667 6.66667H11.3333" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4.66667 10H8.66667" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="block text-base font-semibold text-[#333333] mb-1">
                        Non-Trucking Liability requested effective date
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={effectiveDates.nonTruckingLiability}
                          onChange={(e) => setEffectiveDates({...effectiveDates, nonTruckingLiability: e.target.value})}
                          disabled={sameEffectiveDateForAll}
                          className="w-full p-3 border border-[#D8D8D8] rounded pr-10"
                          placeholder="mm/dd/yyyy"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2H13.3333C13.7754 2 14.1993 2.17559 14.5118 2.48816C14.8244 2.80072 15 3.22464 15 3.66667V13.6667C15 14.1087 14.8244 14.5326 14.5118 14.8452C14.1993 15.1577 13.7754 15.3333 13.3333 15.3333H2.66667C2.22464 15.3333 1.80072 15.1577 1.48816 14.8452C1.17559 14.5326 1 14.1087 1 13.6667V3.66667C1 3.22464 1.17559 2.80072 1.48816 2.48816C1.80072 2.17559 2.22464 2 2.66667 2H4" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.33333 1.33334V2.66667" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.6667 1.33334V2.66667" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4.66667 6.66667H11.3333" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4.66667 10H8.66667" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="block text-base font-semibold text-[#333333] mb-1">
                        Vehicle Physical Damage requested effective date
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={effectiveDates.vehiclePhysicalDamage}
                          onChange={(e) => setEffectiveDates({...effectiveDates, vehiclePhysicalDamage: e.target.value})}
                          disabled={sameEffectiveDateForAll}
                          className="w-full p-3 border border-[#D8D8D8] rounded pr-10"
                          placeholder="mm/dd/yyyy"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2H13.3333C13.7754 2 14.1993 2.17559 14.5118 2.48816C14.8244 2.80072 15 3.22464 15 3.66667V13.6667C15 14.1087 14.8244 14.5326 14.5118 14.8452C14.1993 15.1577 13.7754 15.3333 13.3333 15.3333H2.66667C2.22464 15.3333 1.80072 15.1577 1.48816 14.8452C1.17559 14.5326 1 14.1087 1 13.6667V3.66667C1 3.22464 1.17559 2.80072 1.48816 2.48816C1.80072 2.17559 2.22464 2 2.66667 2H4" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.33333 1.33334V2.66667" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.6667 1.33334V2.66667" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4.66667 6.66667H11.3333" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4.66667 10H8.66667" stroke="#007B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Button Bar */}
      <div className="w-full bg-[#E6EEEF] flex justify-between items-center p-4">
        <button
          type="button"
          onClick={handlePreviousStep}
          className="flex items-center gap-2 text-[#007B87] px-4 py-2 rounded border border-[#007B87]"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="rotate-180"
          >
            <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="#007B87"/>
          </svg>
          Plan Coverage and Design
        </button>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-[#007B87] px-4 py-2 rounded border border-[#007B87]"
          >
            Other Option
          </button>
          
          <button
            type="button"
            onClick={handleNextStep}
            className="flex items-center gap-2 text-white bg-[#007B87] px-4 py-2 rounded"
          >
            Summary
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
