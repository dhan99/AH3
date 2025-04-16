'use client';

import React, { useState } from 'react';
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
  
  const [unitsByState, setUnitsByState] = useState([{ state: '', units: '' }]);
  const [vehicleCounts, setVehicleCounts] = useState({
    lessThan10000: '',
    between10000And26000: '',
    moreThan26000: ''
  });
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
  const handleNextStep = () => router.push('/submission/coverage-plan-liability');
  
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
                      <div className="mb-4">
                        <div className="bg-[#F2FBFC] p-3 mb-4">
                          <h4 className="font-semibold text-[#333333]">Power Units</h4>
                        </div>
                        <div className="flex flex-wrap items-end gap-6">
                          <div className="w-full md:w-1/4">
                            <label className="block text-sm font-semibold text-[#333333] mb-1">Number of Units</label>
                            <input
                              type="number"
                              value={powerUnits.units}
                              onChange={(e) => setPowerUnits({...powerUnits, units: e.target.value})}
                              className="w-full p-3 border border-[#D8D8D8] rounded"
                            />
                          </div>
                          <div className="w-full md:w-1/4">
                            <label className="block text-sm font-semibold text-[#333333] mb-1">TIV</label>
                            <input
                              type="text"
                              value={powerUnits.tiv}
                              onChange={(e) => setPowerUnits({...powerUnits, tiv: e.target.value})}
                              className="w-full p-3 border border-[#D8D8D8] rounded"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="bg-[#F2FBFC] p-3 mb-4">
                          <h4 className="font-semibold text-[#333333]">Trailers</h4>
                        </div>
                        <div className="flex flex-wrap items-end gap-6">
                          <div className="w-full md:w-1/4">
                            <label className="block text-sm font-semibold text-[#333333] mb-1">Number of Units</label>
                            <input
                              type="number"
                              value={trailers.units}
                              onChange={(e) => setTrailers({...trailers, units: e.target.value})}
                              className="w-full p-3 border border-[#D8D8D8] rounded"
                            />
                          </div>
                          <div className="w-full md:w-1/4">
                            <label className="block text-sm font-semibold text-[#333333] mb-1">TIV</label>
                            <input
                              type="text"
                              value={trailers.tiv}
                              onChange={(e) => setTrailers({...trailers, tiv: e.target.value})}
                              className="w-full p-3 border border-[#D8D8D8] rounded"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <hr className="my-4 border-[#D8D8D8]" />
                      
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
                  
                  {key === 'effectiveDates' && (
                    <div>
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="sameEffectiveDate"
                          checked={sameEffectiveDateForAll}
                          onChange={(e) => setSameEffectiveDateForAll(e.target.checked)}
                          className="mr-2 h-4 w-4 accent-[#007B87]"
                        />
                        <label htmlFor="sameEffectiveDate" className="text-base text-[#333333]">
                          Same effective date for all
                        </label>
                      </div>
                      
                      <div className="space-y-4">
                        {Object.entries(effectiveDates).map(([type, date]) => (
                          <div key={type}>
                            <label className="block text-base font-semibold text-[#333333] mb-2">
                              {type === 'occupationalAccident' && 'Occupational Accident requested effective date'}
                              {type === 'nonTruckingLiability' && 'Non-Trucking Liability requested effective date'}
                              {type === 'vehiclePhysicalDamage' && 'Vehicle Physical Damage requested effective date'}
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="mm/dd/yyyy"
                                value={date}
                                onChange={(e) => {
                                  if (sameEffectiveDateForAll) {
                                    setEffectiveDates({
                                      occupationalAccident: e.target.value,
                                      nonTruckingLiability: e.target.value,
                                      vehiclePhysicalDamage: e.target.value
                                    });
                                  } else {
                                    setEffectiveDates({
                                      ...effectiveDates,
                                      [type]: e.target.value
                                    });
                                  }
                                }}
                                className="w-full lg:w-1/3 p-3 border border-[#D8D8D8] rounded pr-10"
                              />
                              <svg 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#007B87]"
                                width="20" height="20" viewBox="0 0 20 20" fill="none"
                              >
                                <path d="M15 2H17C17.5304 2 18.0391 2.21071 18.4142 2.58579C18.7893 2.96086 19 3.46957 19 4V18C19 18.5304 18.7893 19.0391 18.4142 19.4142C18.0391 19.7893 17.5304 20 17 20H3C2.46957 20 1.96086 19.7893 1.58579 19.4142C1.21071 19.0391 1 18.5304 1 18V4C1 3.46957 1.21071 2.96086 1.58579 2.58579C1.96086 2.21071 2.46957 2 3 2H5" stroke="#007B87" strokeWidth="2"/>
                              </svg>
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
              className="flex items-center gap-2 border-2 border-[#007B87] text-[#007B87] px-4 py-2 rounded"
            >
              <svg className="transform rotate-180" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Plan Coverage and Design
            </button>
            
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 bg-[#007B87] text-white px-4 py-2 rounded"
            >
              Coverage and Liability
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
