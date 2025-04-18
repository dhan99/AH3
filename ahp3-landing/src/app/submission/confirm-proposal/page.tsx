'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import { Breadcrumb, ProgressStepper } from '@/components/submission';

export default function ConfirmProposalPage() {
  const router = useRouter();
  const { isLoading, logout, user: authUser } = useMockAuth();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'recap' | 'quote' | 'proposal'>('recap');
  
  // State for proposal details (if needed)
  const [effectiveDate, setEffectiveDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [proposalName, setProposalName] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  
  // State for proposal checkboxes
  const [confirmationChecks, setConfirmationChecks] = useState({
    infoAccurate: false,
    termsAccepted: false
  });

  // State for quote description
  const [quoteDescription, setQuoteDescription] = useState('');
  
  // Navigation handlers
  const handlePreviousStep = () => {
    router.push('/submission/coverage-plan');
  };
  
  const handleCreateProposal = () => {
    // In a real app, this would send the proposal to the backend
    // and then navigate to a success page or dashboard
    router.push('/dashboard/submissions');
  };
  
  // Tab change handler
  const handleTabChange = (tab: 'recap' | 'quote' | 'proposal') => {
    setActiveTab(tab);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checkName: keyof typeof confirmationChecks) => {
    setConfirmationChecks(prev => ({
      ...prev,
      [checkName]: !prev[checkName]
    }));
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

  // Mock data for questionnaire recap tab
  const motorCarrierInfo = {
    name: 'Very Good Trucking Co.',
    dba: 'Some Trucking Co. Doing Business As Name',
    address: '450 Rusty Rd\nAtownin, Alabama 01234',
    dot: 'USDOT1523020'
  }

  const recapSections = [
    {
      title: 'Motor Carrier',
      items: [
        { label: 'Name', value: 'Very Good Trucking' },
        { label: 'Address', value: '...' },
        { label: 'Motor Carrier DOT', value: '1234HUYSUYGI' },
        { label: 'MC Number', value: '.....' }
      ]
    },
    {
      title: 'Products',
      items: [
        { 
          label: 'Coverage', 
          value: 'Occupational Accident\nNon-Trucking Liability\nVehicle Physical Damage' 
        }
      ]
    },
    {
      title: 'Contact',
      items: [
        { label: 'Contact', value: 'James Wilson' },
        { label: 'Email', value: 'jwilson@vgtrucks.com' },
        { label: 'Address', value: '12 Street\nAnytown, VA 01234' },
        { label: 'Phone', value: '123-456-7890' }
      ]
    },
    {
      title: 'Vehicles',
      items: [
        { 
          label: 'Types', 
          value: '10% Box\n10% Flatbed\n20% Refrigerated' 
        },
        { 
          label: ' ', 
          value: '10% Dump\n10% Inter-modal\n20% Tankers\n20% Other [Type]' 
        }
      ]
    },
    {
      title: 'Haul',
      items: [
        { label: 'Hazard', value: 'Radioactive 3-eyed Fish' },
        { label: 'Fruit', value: 'Kiwis\nApples' },
        { label: 'Livestock', value: 'Chinchillas' }
      ]
    },
    {
      title: 'Loss History',
      items: [
        { label: 'Claims', value: '2' },
        { label: 'Paid Losses', value: '$123,456' }
      ]
    }
  ];
  
  // Mock data for quote tab
  const quoteDetails = {
    effectiveDate: 'dd/mm/yyyy',
    coverages: {
      occupationalAccident: {
        monthlyPerDriver: '$300',
        drivers: '12',
        totalPremium: '$XXXXX',
        aggregateLimitOfLiability: '$2,000,000',
        accidentalDeathBenefit: '$50,000 / 365 days',
        survivorsBenefit: 'up to $200,000 / up to $2,000 month',
        accDismembermentBenefit: 'up to $250,000 / 365 days',
        temporaryTotalDisability: '$125-700/week  10-104 weeks',
        accMedExpenseBenefit: '$500,000',
        continuousTotalDisability: '$50-$700/week',
        accidentalMedicalExpense: '$1,000,000'
      },
      nonTruckingLiability: {
        effectiveDate: 'dd/mm/yyyy',
        costPerUnit: '$300',
        units: '5',
        limit: '$1,000,000',
        monthlyRate: '$[xx.00] monthly rate per scheduled unit'
      },
      vehiclePhysicalDamage: {
        effectiveDate: 'dd/mm/yyyy',
        deductible: '$1,000',
        annualCostPerUnit: '$ZZZ',
        tiv: '$ZZZ',
        monthlyRate: '$[X.00]% X Total Insured Value (TIV) / 12 monthly rate per unit',
        limits: {
          anyOneTruck: '$250,000',
          anyOneAccident: '$1,500,000',
          anyOnePolicy: '$5,000,000'
        },
        endorsements: [
          { name: 'Truck Rental', limit: 'Up to $100.00 per Day for up to 14 Days', deductible: 'N/A' },
          { name: 'Extended Repair Time', limit: '$5,000 per month for up to 180 days', deductible: '$250' },
          { name: 'Special Equipment', limit: '$5,000', deductible: '$250' },
          { 
            name: 'Finance Agreement Gap',
            limit: 'Greater of Actual Cash Value or the outstanding Financial Obligation not more then $25,000.00 above Actual Cash Value, not to exceed Stated Amount on applicable Certificate of Insurance',
            deductible: 'N/A'
          }
        ]
      }
    },
    taxes: {
      stateTaxes1: '$1',
      stateTaxes2: '$1',
      totalTaxes: '$2',
      surcharges: '$1',
      totalAnnualPremium: '$1'
    },
    note: 'Add a note here about this quote - i.e. Option with 2M limit on XYZ'
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
                <h2 className="text-base font-semibold text-[#007B87]">{motorCarrierInfo.name}</h2>
                <p className="text-sm text-[#007B87]">DBA: {motorCarrierInfo.dba}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-[#007B87] whitespace-pre-line">{motorCarrierInfo.address}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-[#007B87]">{motorCarrierInfo.dot}</p>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="w-full border-b border-[#D8D8D8] mb-6">
            <div className="flex">
              <button
                className={`px-6 py-3 ${activeTab === 'recap' ? 'text-[#007B87] border-b-2 border-[#007B87] font-semibold' : 'text-[#333333]'}`}
                onClick={() => handleTabChange('recap')}
              >
                Intake Questionnaire Recap
              </button>
              <button
                className={`px-6 py-3 ${activeTab === 'quote' ? 'text-[#007B87] border-b-2 border-[#007B87] font-semibold' : 'text-[#333333]'}`}
                onClick={() => handleTabChange('quote')}
              >
                Quote
              </button>
              <button
                className={`px-6 py-3 ${activeTab === 'proposal' ? 'text-[#007B87] border-b-2 border-[#007B87] font-semibold' : 'text-[#333333]'}`}
                onClick={() => handleTabChange('proposal')}
              >
                Proposal
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="w-full">
            {/* Intake Questionnaire Recap Tab */}
            {activeTab === 'recap' && (
              <div className="space-y-6">
                {recapSections.map((section, idx) => (
                  <div key={idx} className="w-full bg-white border border-[#D8D8D8] rounded-lg mb-4">
                    <div className="w-full bg-[#F5F8FA] p-4 border-b border-[#D8D8D8] flex justify-between items-center">
                      <h2 className="text-base font-semibold text-[#333333]">{section.title}</h2>
                      <button className="text-[#007B87]">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.5 14.5L14.5 1.5M1.5 1.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {section.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex flex-col px-4 py-2">
                            <span className="text-sm text-[#757575]">{item.label}</span>
                            <span className="text-sm font-semibold text-[#333333] whitespace-pre-line">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Section Headers */}
                <div className="pt-6">
                  <h2 className="text-xl font-semibold text-[#333333] mb-2">Occupational Accident</h2>
                  <span className="text-sm text-[#333333]">Effective date: 01/01/2025</span>
                </div>
                
                <div className="pt-6">
                  <h2 className="text-xl font-semibold text-[#333333] mb-2">Non-Trucking Liability Coverage</h2>
                  <span className="text-sm text-[#333333]">Effective date: 01/01/2025</span>
                </div>
                
                <div className="pt-6">
                  <h2 className="text-xl font-semibold text-[#333333] mb-2">Vehicle Physical Damage</h2>
                  <span className="text-sm text-[#333333]">Effective date: 01/01/2025</span>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleTabChange('quote')}
                    className="bg-white border-2 border-[#007B87] text-[#007B87] font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#F2FBFC]"
                  >
                    Quote
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Quote Tab */}
            {activeTab === 'quote' && (
              <div className="space-y-6">
                {/* Quote Description */}
                <div className="w-full bg-white border border-[#D8D8D8] rounded-lg p-6">
                  <div className="flex flex-col mb-4">
                    <label className="block text-base font-semibold text-[#333333] mb-2">Quote Description</label>
                    <textarea
                      value={quoteDescription || quoteDetails.note}
                      onChange={(e) => setQuoteDescription(e.target.value)}
                      className="w-full p-3 border border-[#D8D8D8] rounded"
                      rows={2}
                      placeholder="Add a note here about this quote - i.e. Option with 2M limit on XYZ"
                    />
                  </div>
                </div>
                
                {/* Occupational Accident */}
                <div className="w-full">
                  <div className="flex justify-between items-center py-6">
                    <h2 className="text-xl font-semibold text-[#333333]">Occupational Accident</h2>
                    <button>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6L8 12L14 6" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="bg-[#F5F8FA] p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Effective Date</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.effectiveDate}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Monthly cost per driver</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.monthlyPerDriver}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Drivers</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.drivers}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Estimated Total Premium</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.totalPremium}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Aggregate Limit of Liability</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.aggregateLimitOfLiability}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Accidental Death Benefit</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.accidentalDeathBenefit}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Survivors Benefit</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.survivorsBenefit}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Temporary Total Disability Benefit</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.temporaryTotalDisability}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Acc Med Expense Benefit</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.accMedExpenseBenefit}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Continuous Total Disability</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.continuousTotalDisability}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Accidental Medical Expense</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.accidentalMedicalExpense}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-2 bg-[#E6EEEF] rounded">
                      <p className="text-base font-semibold text-[#333333]">${quoteDetails.coverages.occupationalAccident.monthlyPerDriver} monthly rate per driver</p>
                    </div>
                  </div>
                </div>
                
                {/* Non-Trucking Liability Coverage */}
                <div className="w-full">
                  <div className="flex justify-between items-center py-6">
                    <h2 className="text-xl font-semibold text-[#333333]">Non-Trucking Liability Coverage</h2>
                    <button>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6L8 12L14 6" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="bg-[#F5F8FA] p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">Effective Date</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.nonTruckingLiability.effectiveDate}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">Cost per unit</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.nonTruckingLiability.costPerUnit}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">Units</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.nonTruckingLiability.units}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">Limit</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.nonTruckingLiability.limit}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-2 bg-[#E6EEEF] rounded">
                      <p className="text-base font-semibold text-[#333333]">{quoteDetails.coverages.nonTruckingLiability.monthlyRate}</p>
                      <p className="text-xs text-[#333333]">The total due monthly is subject to change based upon vehicles covered and any applicable state charges.</p>
                    </div>
                  </div>
                </div>
                
                {/* Vehicle Physical Damage */}
                <div className="w-full">
                  <div className="flex justify-between items-center py-6">
                    <h2 className="text-xl font-semibold text-[#333333]">Vehicle Physical Damage</h2>
                    <button>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6L8 12L14 6" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="bg-[#F5F8FA] p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">Effective Date</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.vehiclePhysicalDamage.effectiveDate}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">Deductible</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.vehiclePhysicalDamage.deductible}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">Annual cost per unit</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.vehiclePhysicalDamage.annualCostPerUnit}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">TIV (total insured value)</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.vehiclePhysicalDamage.tiv}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">Any one covered truck/covered trailer</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.vehiclePhysicalDamage.limits.anyOneTruck}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">Any one accident</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.vehiclePhysicalDamage.limits.anyOneAccident}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-[#757575]">Any one Policy</span>
                        <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.vehiclePhysicalDamage.limits.anyOnePolicy}</span>
                      </div>
                    </div>
                    
                    {/* Endorsements */}
                    <div className="mt-6">
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <div className="text-sm text-[#757575]">Endorsements</div>
                        <div className="text-sm text-[#757575]">Limit</div>
                        <div className="text-sm text-[#757575]">Deductible</div>
                      </div>
                      
                      {quoteDetails.coverages.vehiclePhysicalDamage.endorsements.map((endorsement, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-4 mb-2">
                          <div className="text-sm font-semibold text-[#333333]">{endorsement.name}</div>
                          <div className="text-sm text-[#333333]">{endorsement.limit}</div>
                          <div className="text-sm text-[#333333]">{endorsement.deductible}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-2 bg-[#E6EEEF] rounded">
                      <p className="text-base font-semibold text-[#333333]">{quoteDetails.coverages.vehiclePhysicalDamage.monthlyRate}</p>
                      <p className="text-xs text-[#333333]">Total Insured Value is the monetary value of the equipment as stated on the Schedule</p>
                    </div>
                  </div>
                </div>
                
                {/* Total Taxes and Premiums */}
                <div className="w-full bg-[#E6EEEF] p-6 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-base text-[#333333]">XX State Taxes</span>
                      <span className="text-base font-semibold text-[#333333]">{quoteDetails.taxes.stateTaxes1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base text-[#333333]">XX State Taxes</span>
                      <span className="text-base font-semibold text-[#333333]">{quoteDetails.taxes.stateTaxes2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base text-[#333333]">Total Taxes</span>
                      <span className="text-base font-semibold text-[#333333]">{quoteDetails.taxes.totalTaxes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base text-[#333333]">Surcharges</span>
                      <span className="text-base font-semibold text-[#333333]">{quoteDetails.taxes.surcharges}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base text-[#333333]">Estimated* Total Annual Premium</span>
                      <span className="text-base font-semibold text-[#333333]">{quoteDetails.taxes.totalAnnualPremium}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-[#333333]">*Subject to change based on several factors including current taxes, rates and the number of active units and drivers</p>
                    </div>
                  </div>
                </div>
                
                {/* Quote Actions */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <button className="flex items-center gap-2 bg-white text-[#007B87] px-6 py-3 border-2 border-[#007B87] rounded">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 2V14H14V4L12 2H2Z M12 2V4H14 M6 7H10 M6 10H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Copy quote version
                  </button>
                  <button className="flex items-center gap-2 bg-white text-[#007B87] px-6 py-3 border-2 border-[#007B87] rounded">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 8H15 M8 1V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Commission Options
                  </button>
                  <button className="flex items-center gap-2 bg-white text-[#007B87] px-6 py-3 border-2 border-[#007B87] rounded">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5 4.5L4.5 11.5M4.5 4.5L11.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Edit this quote version
                  </button>
                  <button className="flex items-center gap-2 bg-white text-[#007B87] px-6 py-3 border-2 border-[#007B87] rounded">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4V2H10V4H14V6H2V4H6ZM3 7H13L12 16H4L3 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Discard this version
                  </button>
                  <button className="flex items-center gap-2 bg-white text-[#007B87] px-6 py-3 border-2 border-[#007B87] rounded">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4v8m-4-4h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Use in Proposal
                  </button>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => handleTabChange('proposal')}
                    className="bg-white border-2 border-[#007B87] text-[#007B87] font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#F2FBFC]"
                  >
                    Proposal
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Proposal Tab */}
            {activeTab === 'proposal' && (
              <div className="space-y-6">
                <div className="w-full">
                  <h2 className="text-2xl font-semibold text-[#333333] mb-4">Proposal</h2>
                </div>
                
                {/* Quote Selection Section */}
                <div className="w-full bg-white border border-[#D8D8D8] rounded-lg shadow-md overflow-hidden">
                  <div className="flex justify-between items-center bg-white p-3 border-b border-[#D8D8D8]">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-[#333333]">Quote</span>
                      <span className="text-sm text-[#757575]">00001</span>
                      <span className="text-sm text-[#333333] ml-6">[Quote description content shows here]</span>
                    </div>
                    <span className="text-sm text-[#757575]">Expires mm/dd/yyyy</span>
                  </div>
                  
                  <div className="bg-[#F5F8FA] p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-[#757575]">Occupational Accident: XX per driver per month</p>
                      <p className="text-sm font-semibold text-[#757575]">Non-Trucking Liability: XX monthly per unit</p>
                      <p className="text-sm font-semibold text-[#757575]">Vehicle Physical Damage: XX per unit</p>
                    </div>
                    
                    <div className="mt-6">
                      <button className="flex items-center gap-2 bg-white text-[#007B87] px-4 py-2 border-2 border-[#007B87] rounded text-sm">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 6L5 9L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Remove from proposal
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Checkboxes */}
                <div className="space-y-4 mt-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="infoAccurate"
                      checked={confirmationChecks.infoAccurate}
                      onChange={() => handleCheckboxChange('infoAccurate')}
                      className="mt-1 mr-3"
                    />
                    <label htmlFor="infoAccurate" className="text-[#333333]">
                      What has been entered is true to the best of my knowledge
                    </label>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={confirmationChecks.termsAccepted}
                      onChange={() => handleCheckboxChange('termsAccepted')}
                      className="mt-1 mr-3"
                    />
                    <label htmlFor="termsAccepted" className="text-[#333333]">
                      I have read and understand the full proposal including terms and conditions
                    </label>
                  </div>
                </div>
                
                {/* Proposal Actions */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <button className="flex items-center gap-2 bg-white text-[#007B87] px-6 py-3 border-2 border-[#007B87] rounded">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 10V12H2V10H0V14H16V10H14ZM8 12L3 7L4.4 5.6L7 8.2V0H9V8.2L11.6 5.6L13 7L8 12Z" fill="currentColor"/>
                    </svg>
                    Download quote proposal
                  </button>
                  <button className="flex items-center gap-2 bg-white text-[#007B87] px-6 py-3 border-2 border-[#007B87] rounded">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5 4.5L4.5 11.5M4.5 4.5L11.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add cover note
                  </button>
                  <button
                    disabled={!confirmationChecks.infoAccurate || !confirmationChecks.termsAccepted}
                    className={`flex items-center gap-2 ${
                      confirmationChecks.infoAccurate && confirmationChecks.termsAccepted
                        ? 'bg-[#007B87] text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    } px-6 py-3 rounded`}
                    onClick={handleCreateProposal}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 8H15M8 1V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Send Proposal
                  </button>
                </div>
              </div>
            )}
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
          onClick={() => setActiveTab('proposal')}
          className="bg-[#007B87] text-white font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#005F69]"
        >
          Start New Submission
        </button>
      </div>
    </div>
  );
}
