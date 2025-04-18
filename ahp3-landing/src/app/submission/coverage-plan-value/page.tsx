'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import { Breadcrumb, ProgressStepper } from '@/components/submission';

export default function CoveragePlanValuePage() {
  const router = useRouter();
  const { isLoading, logout, user: authUser } = useMockAuth();
  
  // State for accordion sections
  const [openSections, setOpenSections] = useState({
    unitsByState: true,
    vehicles: true,
    ntlCoverageOptions: true,
    tivForVpd: true,
    vpdCoverageOptions: true,
    effectiveDates: true
  });
  
  const [unitsByState, setUnitsByState] = useState([
    { state: 'Rhode Island', units: '2' },
    { state: 'Massachusetts', units: '4' },
    { state: 'Connecticut', units: '6' },
    { state: 'Vermont', units: '2' }
  ]);
  const [vehicleCounts, setVehicleCounts] = useState({
    lessThan10000: '',
    between10000And26000: '',
    moreThan26000: ''
  });
  const [showAllStates, setShowAllStates] = useState(false);
  const [stateValues, setStateValues] = useState<Record<string, string>>({});
  const [ntlCombinedSingleLimit, setNtlCombinedSingleLimit] = useState<string | null>(null);
  const [vpdLimit, setVpdLimit] = useState<string | null>(null);
  const [vpdDeductible, setVpdDeductible] = useState<string | null>(null);
  const [powerUnits, setPowerUnits] = useState({ units: '', tiv: '$0.00' });
  const [trailers, setTrailers] = useState({ units: '', tiv: '$0.00' });
  const [sameEffectiveDateForAll, setSameEffectiveDateForAll] = useState(false);
  const [effectiveDates, setEffectiveDates] = useState({
    occupationalAccident: 'mm/dd/yyyy',
    nonTruckingLiability: 'mm/dd/yyyy',
    vehiclePhysicalDamage: 'mm/dd/yyyy'
  });
  
  const toggleSection = (section: keyof typeof openSections) => 
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  
  const addUnitState = () => 
    setUnitsByState([...unitsByState, { state: '', units: '' }]);
  
  const updateUnitsByState = (index: number, field: 'state' | 'units', value: string) => {
    const updatedStates = [...unitsByState];
    updatedStates[index] = { ...updatedStates[index], [field]: value };
    setUnitsByState(updatedStates);
  };
  
  const removeUnitState = (index: number) => {
    const updatedStates = [...unitsByState];
    updatedStates.splice(index, 1);
    setUnitsByState(updatedStates);
  };
  
  // List of all US states
  const allStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
    'Wisconsin', 'Wyoming'
  ];
  
  // Initialize state values on component mount and when unitsByState changes
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    
    // Initialize with existing values from unitsByState
    unitsByState.forEach(item => {
      if (item.state && item.units) {
        initialValues[item.state] = item.units;
      }
    });
    
    // Initialize remaining states with empty values
    allStates.forEach(state => {
      if (initialValues[state] === undefined) {
        initialValues[state] = '';
      }
    });
    
    setStateValues(initialValues);
  }, [unitsByState]);
  
  // Update state values when a specific state's value changes
  const handleStateValueChange = (state: string, value: string) => {
    setStateValues(prev => ({
      ...prev,
      [state]: value
    }));
  };
  
  // Save all state values to the unitsByState
  const saveStateValues = () => {
    const updatedUnitsByState = Object.entries(stateValues)
      .filter(([state, units]) => units !== '')
      .map(([state, units]) => ({ state, units }));
    
    setUnitsByState(updatedUnitsByState);
    setShowAllStates(false);
  };
  
  const calculateTotals = () => {
    const totalUnits = (parseInt(powerUnits.units) || 0) + (parseInt(trailers.units) || 0);
    const powerUnitsTiv = parseFloat(powerUnits.tiv.replace(/[$,]/g, '')) || 0;
    const trailersTiv = parseFloat(trailers.tiv.replace(/[$,]/g, '')) || 0;
    return {
      totalUnits,
      totalTiv: (powerUnitsTiv + trailersTiv) ? `$${(powerUnitsTiv + trailersTiv).toLocaleString()}` : '$0'
    };
  };
  
  const handlePreviousStep = () => router.push('/submission/coverage-plan-driver');
  const handleNextStep = () => router.push('/submission/confirm-proposal');
  
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

  const breadcrumbItems = [
    { label: 'home', href: '/dashboard', isIcon: true },
    { label: 'New Submission', href: '/submission' },
    { label: 'Questionnaire', active: true }
  ];
  
  const { totalUnits, totalTiv } = calculateTotals();
  
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
      <Header user={authUser || {}} onLogout={logout} />
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex flex-row">
        <div className="min-w-[260px] shadow-sm bg-white">
          <ProgressStepper steps={steps} />
        </div>
        
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
          
          {/* Accordion sections */}
          {Object.entries(openSections).map(([key, isOpen]) => (
            <div key={key} className="w-full mb-6">
              <button 
                className="flex justify-between items-center p-4 bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
                onClick={() => toggleSection(key as keyof typeof openSections)}
              >
                <h3 className="text-xl font-semibold text-[#333333]">
                  {key === 'unitsByState' && 'Units by State'}
                  {key === 'vehicles' && 'Vehicles'}
                  {key === 'ntlCoverageOptions' && 'NTL Coverage Options'}
                  {key === 'tivForVpd' && 'Total Insured Value (TIV)'}
                  {key === 'vpdCoverageOptions' && 'VPD Coverage Options'}
                  {key === 'effectiveDates' && 'Effective Dates'}
                </h3>
                <svg 
                  width="24" height="24" viewBox="0 0 24 24" fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              
              {isOpen && (
                <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                  {key === 'unitsByState' && (
                    <div>
                      <div className="mb-4">
                        <label className="block text-base font-semibold text-[#333333] mb-4">
                          Where are the units registered?
                        </label>
                        
                        {unitsByState.map((item, index) => (
                          <div key={index} className="flex flex-wrap gap-6 mb-6">
                            <div className="w-full md:w-1/3">
                              <div className="mb-1">
                                <label className="block text-sm font-semibold text-[#333333]">
                                  Number of units<span className="text-[#C60C30]">*</span>
                                </label>
                              </div>
                              <input
                                type="number"
                                value={item.units}
                                onChange={(e) => updateUnitsByState(index, 'units', e.target.value)}
                                className="w-full p-3 border border-[#D8D8D8] rounded"
                              />
                            </div>
                            <div className="w-full md:w-1/3">
                              <div className="mb-1">
                                <label className="block text-sm font-semibold text-[#333333]">
                                  State<span className="text-[#C60C30]">*</span>
                                </label>
                              </div>
                              <div className="relative">
                                <select
                                  value={item.state}
                                  onChange={(e) => updateUnitsByState(index, 'state', e.target.value)}
                                  className="w-full p-3 border border-[#D8D8D8] rounded appearance-none pr-10"
                                >
                                  <option value="">Select state</option>
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
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-end">
                              <button
                                onClick={() => removeUnitState(index)}
                                className="text-[#007B87] font-semibold p-3"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={addUnitState}
                          className="flex items-center gap-2 text-[#007B87] font-semibold border-2 border-[#007B87] px-4 py-2 rounded mt-4"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 1V11M1 6H11" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Add Another
                        </button>
                      </div>
                      
                      <div className="flex items-center text-[#007B87] mt-6 cursor-pointer" onClick={() => setShowAllStates(true)}>
                        <span className="text-base">See all states at once</span>
                      </div>
                      
                      {/* Modal for all states */}
                      {showAllStates && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                          <div className="bg-white rounded-md p-6 w-[90%] max-w-3xl h-[80vh] flex flex-col relative">
                            {/* Close button */}
                            <button 
                              className="absolute top-6 right-6 text-[#333333]" 
                              onClick={() => setShowAllStates(false)}
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            
                            {/* Header */}
                            <div className="text-center mb-6">
                              <h2 className="text-xl font-semibold text-[#333333]">Units by State</h2>
                              <p className="text-base text-[#333333]">Indicate the number of units in each state.</p>
                            </div>
                            
                            {/* Scrollable content */}
                            <div className="overflow-y-auto flex-grow">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {allStates.map(state => (
                                  <div key={state} className="mb-4">
                                    <label className="block text-base font-semibold text-[#333333] mb-1">
                                      {state}
                                    </label>
                                    <input
                                      type="number"
                                      value={stateValues[state] || ''}
                                      onChange={(e) => handleStateValueChange(state, e.target.value)}
                                      className="w-full p-3 border border-[#D8D8D8] rounded"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Footer with Save button */}
                            <div className="mt-6 flex justify-center">
                              <button
                                onClick={saveStateValues}
                                className="bg-[#007B87] text-white py-2 px-8 rounded font-semibold"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {key === 'vehicles' && (
                    <div>
                      <div className="mb-4">
                        <label className="block text-base font-semibold text-[#333333] mb-4">
                          Number of Trucks by Weight
                        </label>
                        
                        <div className="flex flex-row flex-wrap gap-6">
                          <div className="w-full md:w-1/3">
                            <div className="mb-1">
                              <label className="block text-sm font-semibold text-[#333333]">
                                Less than 10,000lbs
                              </label>
                            </div>
                            <input
                              type="number"
                              value={vehicleCounts.lessThan10000}
                              onChange={(e) => setVehicleCounts({...vehicleCounts, lessThan10000: e.target.value})}
                              className="w-full p-3 border border-[#D8D8D8] rounded"
                            />
                          </div>
                          
                          <div className="w-full md:w-1/3">
                            <div className="mb-1">
                              <label className="block text-sm font-semibold text-[#333333]">
                                10,000-26,000 lbs
                              </label>
                            </div>
                            <input
                              type="number"
                              value={vehicleCounts.between10000And26000}
                              onChange={(e) => setVehicleCounts({...vehicleCounts, between10000And26000: e.target.value})}
                              className="w-full p-3 border border-[#D8D8D8] rounded"
                            />
                          </div>
                          
                          <div className="w-full md:w-1/3">
                            <div className="mb-1">
                              <label className="block text-sm font-semibold text-[#333333]">
                                More than 26,000 lbs
                              </label>
                            </div>
                            <input
                              type="number"
                              value={vehicleCounts.moreThan26000}
                              onChange={(e) => setVehicleCounts({...vehicleCounts, moreThan26000: e.target.value})}
                              className="w-full p-3 border border-[#D8D8D8] rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {key === 'ntlCoverageOptions' && (
                    <div>
                      <label className="block text-base font-semibold text-[#333333] mb-4">
                        Combined Single Limit (CSL)
                      </label>
                      <div className="flex gap-4 mb-4">
                        {['$500,000', '$1,000,000'].map(value => (
                          <div 
                            key={value}
                            className={`px-6 py-3 border rounded-sm cursor-pointer 
                              ${ntlCombinedSingleLimit === value ? 'bg-[#F2FBFC] border-[#007B87]' : 'bg-white border-[#D8D8D8]'}`}
                            onClick={() => setNtlCombinedSingleLimit(value)}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                ${ntlCombinedSingleLimit === value ? 'border-[#007B87]' : 'border-[#757575]'}`}
                              >
                                {ntlCombinedSingleLimit === value && <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>}
                              </div>
                              <span className="text-[#333333]">{value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-base font-semibold text-[#333333]">
                        Includes statutory minimum UM/UIM and PIP
                      </div>
                    </div>
                  )}
                  
                  {key === 'vpdCoverageOptions' && (
                    <div>
                      <div className="mb-6">
                        <label className="block text-base font-semibold text-[#333333] mb-4">Limits</label>
                        <div className="flex gap-4 flex-wrap">
                          {['$250,000', '$1,500,000', '$5,000,000'].map(value => (
                            <div 
                              key={value}
                              className={`px-6 py-3 border rounded-sm cursor-pointer 
                                ${vpdLimit === value ? 'bg-[#F2FBFC] border-[#007B87]' : 'bg-white border-[#D8D8D8]'}`}
                              onClick={() => setVpdLimit(value)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                  ${vpdLimit === value ? 'border-[#007B87]' : 'border-[#757575]'}`}
                                >
                                  {vpdLimit === value && <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>}
                                </div>
                                <span className="text-[#333333]">{value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-base font-semibold text-[#333333] mb-4">Deductible</label>
                        <div className="flex gap-4 flex-wrap">
                          {['$1,000', '$2,500', '$5,000'].map(value => (
                            <div 
                              key={value}
                              className={`px-6 py-3 border rounded-sm cursor-pointer 
                                ${vpdDeductible === value ? 'bg-[#F2FBFC] border-[#007B87]' : 'bg-white border-[#D8D8D8]'}`}
                              onClick={() => setVpdDeductible(value)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                  ${vpdDeductible === value ? 'border-[#007B87]' : 'border-[#757575]'}`}
                                >
                                  {vpdDeductible === value && <div className="w-2 h-2 rounded-full bg-[#007B87]"></div>}
                                </div>
                                <span className="text-[#333333]">{value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {key === 'tivForVpd' && (
                    <div>
                      <p className="text-base text-[#333333] mb-6">
                        Please provide the current Total Insured Value (TIV) for your vehicles.
                      </p>
                      
                      <div className="mb-8">
                        <div className="bg-[#F2FBFC] p-3 mb-4">
                          <h4 className="font-semibold text-[#333333]">Power Units</h4>
                        </div>
                        <div className="flex flex-wrap gap-6 mb-2">
                          <div className="w-full md:w-1/3">
                            <div className="mb-1">
                              <label className="block text-sm font-semibold text-[#333333]">
                                Number of Units<span className="text-[#C60C30]">*</span>
                              </label>
                            </div>
                            <input
                              type="number"
                              value={powerUnits.units}
                              onChange={(e) => setPowerUnits({...powerUnits, units: e.target.value})}
                              className="w-full p-3 border border-[#D8D8D8] rounded"
                              placeholder="0"
                            />
                          </div>
                          <div className="w-full md:w-1/3">
                            <div className="mb-1">
                              <label className="block text-sm font-semibold text-[#333333]">
                                TIV<span className="text-[#C60C30]">*</span>
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                value={powerUnits.tiv}
                                onChange={(e) => {
                                  // Format as currency if needed
                                  const value = e.target.value.replace(/[^0-9.]/g, '');
                                  setPowerUnits({...powerUnits, tiv: value ? `$${value}` : '$0.00'});
                                }}
                                className="w-full p-3 border border-[#D8D8D8] rounded pl-8"
                                placeholder="$0.00"
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333333]">
                                {powerUnits.tiv === '$0.00' ? '$' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-[#666666] italic">
                          Enter the number of power unit vehicles and their combined total value
                        </p>
                      </div>
                      
                      <div className="mb-8">
                        <div className="bg-[#F2FBFC] p-3 mb-4">
                          <h4 className="font-semibold text-[#333333]">Trailers</h4>
                        </div>
                        <div className="flex flex-wrap gap-6 mb-2">
                          <div className="w-full md:w-1/3">
                            <div className="mb-1">
                              <label className="block text-sm font-semibold text-[#333333]">
                                Number of Units<span className="text-[#C60C30]">*</span>
                              </label>
                            </div>
                            <input
                              type="number"
                              value={trailers.units}
                              onChange={(e) => setTrailers({...trailers, units: e.target.value})}
                              className="w-full p-3 border border-[#D8D8D8] rounded"
                              placeholder="0"
                            />
                          </div>
                          <div className="w-full md:w-1/3">
                            <div className="mb-1">
                              <label className="block text-sm font-semibold text-[#333333]">
                                TIV<span className="text-[#C60C30]">*</span>
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                value={trailers.tiv}
                                onChange={(e) => {
                                  // Format as currency if needed
                                  const value = e.target.value.replace(/[^0-9.]/g, '');
                                  setTrailers({...trailers, tiv: value ? `$${value}` : '$0.00'});
                                }}
                                className="w-full p-3 border border-[#D8D8D8] rounded pl-8"
                                placeholder="$0.00"
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333333]">
                                {trailers.tiv === '$0.00' ? '$' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-[#666666] italic">
                          Enter the number of trailers and their combined total value
                        </p>
                      </div>
                      
                      <div className="bg-[#E6EEEF] p-6 rounded flex flex-row justify-around">
                        <div className="flex flex-col items-center">
                          <span className="text-base text-[#666666] mb-1">Total units</span>
                          <span className="font-semibold text-xl text-[#333333]">{totalUnits}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-base text-[#666666] mb-1">Total insured value</span>
                          <span className="font-semibold text-xl text-[#333333]">{totalTiv}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {key === 'effectiveDates' && (
                    <div>
                      <div className="flex items-center mb-6">
                        <input
                          type="checkbox"
                          id="sameEffectiveDate"
                          checked={sameEffectiveDateForAll}
                          onChange={(e) => setSameEffectiveDateForAll(e.target.checked)}
                          className="mr-2 h-5 w-5 rounded border-[#D8D8D8] accent-[#007B87]"
                        />
                        <label htmlFor="sameEffectiveDate" className="text-base text-[#333333]">
                          Same effective date for all
                        </label>
                      </div>
                      
                      <div className="space-y-6">
                        {Object.entries(effectiveDates).map(([type, date]) => (
                          <div key={type} className="w-full md:w-2/5">
                            <label className="block text-base font-semibold text-[#333333] mb-2">
                              {type === 'occupationalAccident' && 'Occupational Accident requested effective date'}
                              {type === 'nonTruckingLiability' && 'Non-Trucking Liability requested effective date'}
                              {type === 'vehiclePhysicalDamage' && 'Vehicle Physical Damage requested effective date'}
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                placeholder="mm/dd/yyyy"
                                value={date === 'mm/dd/yyyy' ? '' : date}
                                onChange={(e) => {
                                  const newValue = e.target.value || 'mm/dd/yyyy';
                                  if (sameEffectiveDateForAll) {
                                    // Apply the same date to all fields when checkbox is checked
                                    setEffectiveDates({
                                      occupationalAccident: newValue,
                                      nonTruckingLiability: newValue,
                                      vehiclePhysicalDamage: newValue
                                    });
                                  } else {
                                    // Update only the current field when checkbox is unchecked
                                    setEffectiveDates({
                                      ...effectiveDates,
                                      [type]: newValue
                                    });
                                  }
                                }}
                                className="w-full p-3 border border-[#D8D8D8] rounded pr-10"
                              />
                              <button 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#007B87]"
                                tabIndex={-1}
                                onClick={(e) => {
                                  e.preventDefault();
                                  // This would trigger the date picker in a real implementation
                                  const input = e.currentTarget.previousSibling as HTMLElement;
                                  if (input) input.click();
                                }}
                              >
                                
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {/* Navigation Buttons */}
          <div className="bg-[#E6EEEF] py-4 px-6 flex justify-between items-center">
            <button
              onClick={handlePreviousStep}
              className="flex items-center gap-2 border-2 border-[#007B87] text-[#007B87] px-4 py-2 rounded font-semibold"
            >
              <svg className="transform rotate-180" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Plan Coverage and Design
            </button>
            
            <div className="flex items-center gap-8">
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 bg-[#007B87] text-white px-6 py-2 rounded font-semibold"
              >
                Summary
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
