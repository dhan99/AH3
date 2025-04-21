'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import { Breadcrumb, ProgressStepper } from '@/components/submission';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import useCoveragePlanValueStore from '@/store/useCoveragePlanValueStore';
import useSubmissionStore from '@/store/useSubmissionStore';
import useLossHistoryStore from '@/store/useLossHistoryStore';
import useEligibilityStore from '@/store/useEligibilityStore';
import { handleSignoff } from '@/utils/signoff';

export default function ConfirmProposalPage() {
  const router = useRouter();
  const { isLoading, logout, user: authUser } = useMockAuth();
  
  // State for notification
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState<'recap' | 'quote' | 'proposal'>('recap');
  
  // State for accordion sections
  const [expandedSections, setExpandedSections] = useState({
    occupationalAccident: true,
    nonTruckingLiability: true,
    vehiclePhysicalDamage: true
  });
  
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
    router.push('/submission/coverage-plan-value');
  };

  // Edit Navigation handlers
  const handleEditNavigation = (dest: any) => {
    router.push(dest);
  };
  
  const handleCreateProposal = () => {
    // Show notification that email has been sent
    setNotification({
      isVisible: true,
      message: "Email is sent to contact email address requesting to Motor Carrier to accept the proposal",
      type: 'success'
    });
    
    // Add delay before redirecting to allow notification to be seen
    setTimeout(() => {
      // In a real app, this would send the proposal to the backend
      // and then navigate to a success page or dashboard
      router.push('/dashboard/submissions');
    }, 2000);
  };
  
  // Tab change handler
  const handleTabChange = (tab: 'recap' | 'quote' | 'proposal') => {
    setActiveTab(tab);
  };
  
  // Toggle accordion section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
      ],
      editLink: '/submission'

    },
    {
      title: 'Products',
      items: [
        { 
          label: 'Coverage', 
          value: 'Occupational Accident\nNon-Trucking Liability\nVehicle Physical Damage' 
        }
      ],
      editLink: '/submission'
    },
    {
      title: 'Contact',
      items: [
        { label: 'Contact', value: 'James Wilson' },
        { label: 'Email', value: 'jwilson@vgtrucks.com' },
        { label: 'Address', value: '12 Street\nAnytown, VA 01234' },
        { label: 'Phone', value: '123-456-7890' }
      ],
      editLink: '/submission'
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
      ],
      editLink: '/submission/eligibility'
    },
    {
      title: 'Haul',
      items: [
        { label: 'Hazard', value: 'Radioactive 3-eyed Fish' },
        { label: 'Fruit', value: 'Kiwis\nApples' },
        { label: 'Livestock', value: 'Chinchillas' }
      ],
      editLink: '/submission/eligibility'
    },
    {
      title: 'Loss History',
      items: [
        { label: 'Claims', value: '2' },
        { label: 'Paid Losses', value: '$123,456' }
      ],
      editLink: '/submission/loss-history'
    }
  ];
  
  // Mock data for quote tab
  const quoteDetails = {
    effectiveDate: 'dd/mm/yyyy',
    coverages: {
      occupationalAccident: {
        monthlyPerDriver: '300',
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
        monthlyRate: '$250.00 monthly rate per scheduled unit'
      },
      vehiclePhysicalDamage: {
        effectiveDate: 'dd/mm/yyyy',
        deductible: '$1,000',
        annualCostPerUnit: '$ZZZ',
        tiv: '$ZZZ',
        monthlyRate: '$[7.00]% 75,000 Total Insured Value (TIV) / 12 monthly rate per unit',
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
          
          {/* MC Summary Block */}
          <div className="w-full bg-white rounded-lg border border-[#D8D8D8] shadow-md mb-6">
            <div className="w-full bg-[#F2FBFC] p-4 flex flex-row border-b border-[#D8D8D8] justify-center">
              <div className="flex flex-col flex-1">
                <h2 className="text-base font-semibold text-[#007B87]">{motorCarrierInfo.name}</h2>
                <p className="text-sm text-[#007B87]">DBA: {motorCarrierInfo.dba}</p>
              </div>
              <div className="flex flex-col flex-1 items-center">
                <p className="text-sm text-[#007B87] whitespace-pre-line">{motorCarrierInfo.address}</p>
              </div>
              <div className="flex flex-col flex-1 items-end">
                <p className="text-sm text-[#007B87]">{motorCarrierInfo.dot}</p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[#333333] mb-0 p-4">Confirm and Create Proposal</h1>
          
          {/* Tab Navigation */}
          <div className="w-full border border-[#D8D8D8] bg-white rounded-t-lg mb-6">
            <div className="flex justify-center">
              <div className="flex-1 border-r border-b border-[#D8D8D8]">
                <button
                  className={`w-full px-6 py-4 text-center ${activeTab === 'recap' ? 'bg-[#F2FBFC] text-[#007B87] border-b-2 border-[#007B87] font-semibold' : 'text-[#333333]'}`}
                  onClick={() => handleTabChange('recap')}
                >
                  Intake Questionnaire Recap
                </button>
              </div>
              <div className="flex-1 border-r border-b border-[#D8D8D8]">
                <button
                  className={`w-full px-6 py-4 text-center ${activeTab === 'quote' ? 'bg-[#F2FBFC] text-[#007B87] border-b-2 border-[#007B87] font-semibold' : 'text-[#333333]'}`}
                  onClick={() => handleTabChange('quote')}
                >
                  Quote
                </button>
              </div>
              <div className="flex-1 border-b border-[#D8D8D8]">
                <button
                  className={`w-full px-6 py-4 text-center ${activeTab === 'proposal' ? 'bg-[#F2FBFC] text-[#007B87] border-b-2 border-[#007B87] font-semibold' : 'text-[#333333]'}`}
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
              <div className="space-y-3 p-6" >
                <div className="grid grid-cols-2 gap-4">
                  {recapSections.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-lg mb-4">
                      <div className="bg-[#F5F8FA] ml-2 p-2 flex justify-between items-center">
                        <h2 className="text-base font-semibold text-[#333333]">{section.title}</h2>
                        <button 
                          className="text-[#007B87]" 
                          onClick={() => handleEditNavigation(section.editLink)}
                          >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
</svg>
                        </button>
                      </div>
                      <div className="p-2">
                        <div className="grid grid-cols-1 gap-3">
                          {section.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex flex-col px-4 py-0">
                              <span className="text-sm text-[#757575]">{item.label}</span>
                              <span className="text-sm font-semibold text-[#333333] whitespace-pre-line">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="w-full border-t border-[#D8D8D8] my-6"></div>
                
                {/* Occupational Accident Section */}
                <div className="w-full mb-4">
                  <div className="bg-white rounded-lg">
                    <div className="ml-0 p-0 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-[#333333]">Occupational Accident</h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#333333]">Effective date: 01/01/2025</span>
                        <button className="text-[#007B87]" onClick={() => handleEditNavigation("/submission/coverage-plan-driver")} >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                          </svg>
                        </button>
                        <button 
                          className="text-[#007B87]"
                          onClick={() => toggleSection('occupationalAccident')}
                          aria-expanded={expandedSections.occupationalAccident}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d={expandedSections.occupationalAccident ? "M2 10L8 4L14 10" : "M2 6L8 12L14 6"} 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {expandedSections.occupationalAccident && (
                      <div className="p-0">
                        <div className="grid grid-cols-2 gap-6">

                          <div className="bg-white mt-5">
                            <div className="gap-2 bg-[#F5F8FA] mb-4 ">
                              <div className="flex flex-row justify-center ml-2 mr-2">
                                <div className="flex flex-col flex-1 ">
                                  <h2 className="text-base font-semibold text-[#333333]">OO and Contract Drivers</h2>
                                </div>
                                <div className="flex flex-col flex-1 items-end">
                                  <button className="text-[#007B87] items-end" onClick={() => handleEditNavigation("/submission/coverage-plan-driver")} >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-3">
                              <div>
                                <p className="text-sm text-[#757575]">Owner Operators</p>
                                <p className="text-sm font-semibold text-[#333333]">14<br/>RI, MA, CT, VT</p>
                              </div>
                              <div>
                                <p className="text-sm text-[#757575]">Contract Drivers</p>
                                <p className="text-sm font-semibold text-[#333333]">14<br/>RI, MA, CT, VT</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white mt-5">
                            <div className="gap-2 bg-[#F5F8FA] mb-4">
                              <div className="flex flex-row justify-center">
                                <div className="flex flex-col flex-1">
                                  <h2 className="text-base font-semibold text-[#333333]">Selected Coverage</h2>
                                </div>
                                <div className="flex flex-col flex-1 items-end">
                                  <button className="text-[#007B87] items-end" onClick={() => handleEditNavigation("/submission/coverage-plan-driver")} >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-2">
                              <div>
                                <p className="text-sm text-[#757575]">Accidental Death and Dismemberment Benefit Limit</p>
                                <p className="text-sm font-semibold text-[#333333]">$200,000</p>
                              </div>
                              <div>
                                <p className="text-sm text-[#757575]">Disability Benefit (TTD and CTD)</p>
                                <p className="text-sm font-semibold text-[#333333]">$500 weekly benefit</p>
                              </div>
                              <div>
                                <p className="text-sm text-[#757575]">Accident Medical Benefit</p>
                                <p className="text-sm font-semibold text-[#333333]">$500,000</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
                
                <div className="w-full border-t border-[#D8D8D8] my-6"></div>
                
                {/* Non-Trucking Liability Coverage */}
                <div className="w-full mb-4">
                  <div className="bg-white rounded-lg">
                    <div className="ml-0 p-0 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-[#333333]">Non-Trucking Liability Coverage</h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#333333]">Effective date: 01/01/2025</span>
                        <button className="text-[#007B87]" onClick={() => handleEditNavigation('/submission/coverage-plan-value')} >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                          </svg>
                        </button>
                        <button 
                          className="text-[#007B87]"
                          onClick={() => toggleSection('nonTruckingLiability')}
                          aria-expanded={expandedSections.nonTruckingLiability}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d={expandedSections.nonTruckingLiability ? "M2 10L8 4L14 10" : "M2 6L8 12L14 6"} 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {expandedSections.nonTruckingLiability && (
                      <div className="p-0">
                        <div className="grid grid-cols-2 gap-6">

                          <div className="bg-white mt-5">
                            <div className="gap-2 bg-[#F5F8FA] mb-4 ">
                              <div className="flex flex-row justify-center ml-2 mr-2">
                                <div className="flex flex-col flex-1 ">
                                  <h2 className="text-base font-semibold text-[#333333]">Units by State</h2>
                                </div>
                                <div className="flex flex-col flex-1 items-end">
                                  <button className="text-[#007B87] items-end" onClick={() => handleEditNavigation('/submission/coverage-plan-value')} >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-3">
                              <p className="text-sm font-semibold text-[#333333]">
                                RI - 2<br/>
                                MA - 4<br/>
                                CT - 6<br/>
                                VT - 2
                              </p>
                            </div>
                          </div>
                          <div className="bg-white mt-5">
                            <div className="gap-2 bg-[#F5F8FA] mb-3">
                              <div className="flex flex-row justify-center">
                                <div className="flex flex-col flex-1">
                                  <h2 className="text-base font-semibold text-[#333333]">Selected Coverage</h2>
                                </div>
                                <div className="flex flex-col flex-1 items-end">
                                  <button className="text-[#007B87] items-end" onClick={() => handleEditNavigation('/submission/coverage-plan-value')} >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 ml-2">
                              <p className="text-sm text-[#757575]">Combined Single Limit</p>
                              <p className="text-sm font-semibold text-[#333333]">$1,000,000</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 mt-2 ml-0">
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-[#757575]">Trucks by Weight</p>
                              <p className="text-sm font-semibold text-[#333333]">
                                Less than 10,000<br/>
                                10,000-26,000<br/>
                                More than 26,000
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-[#333333]">&nbsp;</p>
                              <p className="text-sm font-semibold text-[#333333]">
                                4<br/>
                                6<br/>
                                8
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-full border-t border-[#D8D8D8] my-6"></div>
                
                {/* Vehicle Physical Damage */}
                <div className="w-full mb-4">
                  <div className="bg-white rounded-lg">
                    <div className=" ml-0 p-0 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-[#333333]">Vehicle Physical Damage</h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#333333]">Effective date: 01/01/2025</span>
                        <button className="text-[#007B87]" onClick={() => handleEditNavigation('/submission/coverage-plan-value')} >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                          </svg>
                        </button>
                        <button 
                          className="text-[#007B87]"
                          onClick={() => toggleSection('vehiclePhysicalDamage')}
                          aria-expanded={expandedSections.vehiclePhysicalDamage}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                              d={expandedSections.vehiclePhysicalDamage ? "M2 10L8 4L14 10" : "M2 6L8 12L14 6"} 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    

                    {expandedSections.occupationalAccident && (
                      <div className="p-0">
                        <div className="grid grid-cols-2 gap-6">

                          <div className="bg-white mt-5">
                            <div className="gap-2 bg-[#F5F8FA] mb-4 ">
                              <div className="flex flex-row justify-center ml-2 mr-2">
                                <div className="flex flex-col flex-1 ">
                                  <h2 className="text-base font-semibold text-[#333333]">Total Insured Value</h2>
                                </div>
                                <div className="flex flex-col flex-1 items-end">
                                  <button className="text-[#007B87] items-end" onClick={() => handleEditNavigation('/submission/coverage-plan-value')} >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-3">
                              <div>
                                <p className="text-sm text-[#757575]">Total units</p>
                                <p className="text-sm font-semibold text-[#333333]">2</p>
                              </div>
                              <div>
                                <p className="text-sm text-[#757575]">Total TIV</p>
                                <p className="text-sm font-semibold text-[#333333]">$123,456</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white mt-5">
                            <div className="gap-2 bg-[#F5F8FA] mb-4">
                              <div className="flex flex-row justify-center">
                                <div className="flex flex-col flex-1">
                                  <h2 className="text-base font-semibold text-[#333333]">Selected Coverage</h2>
                                </div>
                                <div className="flex flex-col flex-1 items-end">
                                  <button className="text-[#007B87] items-end">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 ml-2">
                              <div>
                                <p className="text-sm text-[#757575]">Deductible</p>
                                <p className="text-sm font-semibold text-[#333333]">$500</p>
                              </div>
                              <div>
                                <p className="text-sm text-[#757575]">Endorsements</p>
                                <p className="text-sm font-semibold text-[#333333]">TBD</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end mt-0">
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
              <div className="space-y-1">
                <div className="flex items-center space-x-2 border-1 border-[#D8D8D8] h-16">
                  <span className="text-lg font-semibold text-[#333333] ml-4">Quote</span>
                  <span className="text-sm text-[#757575] mt-1">00001</span>
                </div>
                {/* Quote Description */}
                <div className="w-full bg-white border-0 border-[#D8D8D8] rounded-lg p-6">
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
                <div className="w-full p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-[#333333]">Occupational Accident</h2>
                    <button onClick={() => toggleSection('occupationalAccident')}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d={expandedSections.occupationalAccident ? "M2 10L8 4L14 10" : "M2 6L8 12L14 6"} stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  
                  {expandedSections.occupationalAccident && (
                    <div className="bg-[#FFFFFF] rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
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
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Acc Dismemberment Benefit</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.accDismembermentBenefit}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Temporary Total Disability Benefit</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.temporaryTotalDisability}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-[#757575]">Acc Med Expense Benefit</span>
                          <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.occupationalAccident.accMedExpenseBenefit}</span>
                        </div>
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
                    <div className="flex p-4 bg-[#E6EEEF] justify-center items-center rounded">
                      <p className="text-base font-semibold text-[#333333] text-justify">${quoteDetails.coverages.occupationalAccident.monthlyPerDriver} monthly rate per driver</p>
                    </div>
                    </div>
                  )}
                </div>
                
                {/* Non-Trucking Liability Coverage */}
                <div className="w-full p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-[#333333]">Non-Trucking Liability Coverage</h2>
                    <button onClick={() => toggleSection('nonTruckingLiability')}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d={expandedSections.nonTruckingLiability ? "M2 10L8 4L14 10" : "M2 6L8 12L14 6"} stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  {expandedSections.nonTruckingLiability && (
                    <div className="bg-[#FFFFFF] rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-[#757575]">Effective Date</span>
                            <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.nonTruckingLiability.effectiveDate}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-[#757575]">Cost per unit</span>
                            <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.nonTruckingLiability.costPerUnit}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-[#757575]">Units</span>
                            <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.nonTruckingLiability.units}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-[#757575]">Limit</span>
                            <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.nonTruckingLiability.limit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-[#E6EEEF] rounded">
                        <div className="flex justify-center items-center ">
                          <p className="text-base font-semibold text-[#333333] text-justify">{quoteDetails.coverages.nonTruckingLiability.monthlyRate}</p>
                        </div>
                        <div className="flex justify-center items-center ">
                          <p className="text-xs text-[#333333]">The total due monthly is subject to change based upon vehicles covered and any applicable state charges.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Vehicle Physical Damage */}
                <div className="w-full p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-[#333333]">Vehicle Physical Damage</h2>
                    <button onClick={() => toggleSection('vehiclePhysicalDamage')}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d={expandedSections.vehiclePhysicalDamage ? "M2 10L8 4L14 10" : "M2 6L8 12L14 6"} stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  {expandedSections.vehiclePhysicalDamage && (
                    <div className="bg-[#FFFFFF] rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        <div className="flex flex-col gap-4">
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
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-[#757575]">TIV (total insured value)</span>
                            <span className="text-sm font-semibold text-[#333333]">{quoteDetails.coverages.vehiclePhysicalDamage.tiv}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
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
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3 ml-6">
                        <div className="flex flex-col gap-4">
                          <div className="text-sm text-[#757575]">Endorsements</div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="text-sm text-[#757575]">Limit</div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="text-sm text-[#757575]">Deductible</div>
                        </div>
                      </div>

                      {quoteDetails.coverages.vehiclePhysicalDamage.endorsements.map((endorsement, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2 ml-6 ">
                        <div className="flex flex-col gap-4">
                          <div className="text-sm font-semibold text-[#333333]">{endorsement.name}</div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="text-sm text-[#333333]">{endorsement.limit}</div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="text-sm text-[#333333]">{endorsement.deductible}</div>
                        </div>
                      </div>
                      ))}
                      <div className="p-4 bg-[#E6EEEF] rounded">
                        <div className="flex justify-center items-center ">
                          <p className="text-base font-semibold text-[#333333]">{quoteDetails.coverages.vehiclePhysicalDamage.monthlyRate}</p>
                        </div>
                        <div className="flex justify-center items-center ">
                          <p className="text-xs text-[#333333]">Total Insured Value is the monetary value of the equipment as stated on the Schedule</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Total Taxes and Premiums */}
                <div className="w-full p-6">
                  <div className="bg-[#E6EEEF] rounded-lg space-y-3 p-6">
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

                     {/* Quote Actions */}
                  <div className="flex flex-wrap mt-8 font-semibold text-sm">
                    <button className="flex items-center gap-2 bg-white text-[#007B87] px-3 py-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.8786 5.49805H5.581C4.70858 5.49805 4 6.20663 4 7.07904V20.4192C4 21.2916 4.70858 22.0002 5.581 22.0002H14.8786C15.751 22.0002 16.4596 21.2916 16.4596 20.4192V7.07904C16.4555 6.20663 15.7469 5.49805 14.8786 5.49805ZM15.3496 20.4151C15.3496 20.6772 15.1366 20.8902 14.8745 20.8902H5.5769C5.31477 20.8902 5.10178 20.6772 5.10178 20.4151V7.07904C5.10178 6.81691 5.31477 6.60392 5.5769 6.60392H14.8745C15.1366 6.60392 15.3496 6.81691 15.3496 7.07904V20.4151Z" fill="#007B87"/>
                        <path d="M18.4342 2H9.13666C8.26425 2 7.55566 2.70858 7.55566 3.581C7.55566 3.88818 7.80141 4.13393 8.1086 4.13393C8.41579 4.13393 8.66154 3.88818 8.66154 3.581C8.66154 3.31886 8.87453 3.10588 9.13666 3.10588H18.4342C18.6964 3.10588 18.9093 3.31886 18.9093 3.581V16.9212C18.9093 17.1833 18.6964 17.3963 18.4342 17.3963C18.127 17.3963 17.8813 17.642 17.8813 17.9492C17.8813 18.2564 18.127 18.5022 18.4342 18.5022C19.3066 18.5022 20.0152 17.7936 20.0152 16.9212V3.581C20.0152 2.70858 19.3066 2 18.4342 2Z" fill="#007B87"/>
                        <path d="M14.8786 5.49805H5.581C4.70858 5.49805 4 6.20663 4 7.07904V20.4192C4 21.2916 4.70858 22.0002 5.581 22.0002H14.8786C15.751 22.0002 16.4596 21.2916 16.4596 20.4192V7.07904C16.4555 6.20663 15.7469 5.49805 14.8786 5.49805ZM15.3496 20.4151C15.3496 20.6772 15.1366 20.8902 14.8745 20.8902H5.5769C5.31477 20.8902 5.10178 20.6772 5.10178 20.4151V7.07904C5.10178 6.81691 5.31477 6.60392 5.5769 6.60392H14.8745C15.1366 6.60392 15.3496 6.81691 15.3496 7.07904V20.4151Z" fill="#007B87"/>
                        <path d="M18.4342 2H9.13666C8.26425 2 7.55566 2.70858 7.55566 3.581C7.55566 3.88818 7.80141 4.13393 8.1086 4.13393C8.41579 4.13393 8.66154 3.88818 8.66154 3.581C8.66154 3.31886 8.87453 3.10588 9.13666 3.10588H18.4342C18.6964 3.10588 18.9093 3.31886 18.9093 3.581V16.9212C18.9093 17.1833 18.6964 17.3963 18.4342 17.3963C18.127 17.3963 17.8813 17.642 17.8813 17.9492C17.8813 18.2564 18.127 18.5022 18.4342 18.5022C19.3066 18.5022 20.0152 17.7936 20.0152 16.9212V3.581C20.0152 2.70858 19.3066 2 18.4342 2Z" fill="#007B87"/>
                      </svg>
                      Copy quote version
                    </button>
                    <button className="flex items-center bg-white text-[#007B87] px-3 py-3 ">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.9998 20.8637C7.11239 20.8637 3.13634 16.8877 3.13634 12.0003C3.13634 7.11277 7.11239 3.13683 11.9998 3.13683C16.8872 3.13683 20.8632 7.11277 20.8632 12.0003C20.8632 16.8877 16.8872 20.8637 11.9998 20.8637ZM11.9998 2.00049C6.48615 2.00049 2 6.48664 2 12.0003C2 17.5138 6.48615 22.0001 11.9998 22.0001C17.5143 22.0001 21.9996 17.5138 21.9996 12.0003C21.9996 6.48664 17.5143 2.00049 11.9998 2.00049ZM14.9543 14.1036C14.9543 15.3547 14.0814 16.2752 12.7725 16.4808V17.373C12.7725 17.6865 12.518 17.9411 12.2043 17.9411C11.8907 17.9411 11.6362 17.6865 11.6362 17.373V16.4649C10.6919 16.2672 9.90438 15.582 9.59188 14.6377C9.49291 14.3387 9.65427 14.0173 9.95199 13.9195C10.2508 13.8207 10.5724 13.982 10.6703 14.2797C10.8907 14.9422 11.5066 15.3877 12.2043 15.3877C12.985 15.3877 13.8179 15.0502 13.8179 14.1036C13.8179 13.2355 12.8907 12.8083 12.0839 12.5332L12.0191 12.5116C11.9838 12.4991 11.943 12.4855 11.8964 12.4707C11.2282 12.2525 9.45439 11.673 9.45439 9.84575C9.45439 8.59351 10.327 7.67307 11.6362 7.46751V6.53446C11.6362 6.22083 11.8907 5.96629 12.2043 5.96629C12.518 5.96629 12.7725 6.22083 12.7725 6.53446V7.48205C13.7327 7.68216 14.5223 8.38101 14.827 9.34576C14.9213 9.64462 14.7554 9.96382 14.4553 10.0581C14.1554 10.1525 13.8372 9.98552 13.7429 9.68667C13.5304 9.01282 12.9122 8.56055 12.2043 8.56055C11.4247 8.56055 10.5907 8.89805 10.5907 9.84575C10.5907 10.7276 11.3883 11.1092 12.2497 11.3912C12.3021 11.4082 12.3498 11.4241 12.3906 11.4378L12.4498 11.4582C13.0691 11.6683 14.9543 12.3105 14.9543 14.1036Z" fill="#007B87"/>
                      </svg>
                      Commission Options
                    </button>
                    <button className="flex items-center bg-white text-[#007B87] px-3 py-3 ">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                      </svg>
                      Edit this quote version
                    </button>
                    <button className="flex items-center bg-white text-[#007B87] px-3 py-3 ">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.24162 6.96552H18.7589V5.86207H5.24162V6.96552ZM16.3354 20.6207H7.66506L6.5492 8.34483H17.4513L16.3354 20.6207ZM10.2071 4.48276H13.7933V3.37931H10.2071V4.48276ZM19.4485 4.48276H15.1726V2.68966C15.1726 2.30897 14.8637 2 14.483 2H9.51748C9.13679 2 8.82782 2.30897 8.82782 2.68966V4.48276H4.55196C4.17127 4.48276 3.8623 4.79172 3.8623 5.17241V7.65517C3.8623 8.03586 4.17127 8.34483 4.55196 8.34483H5.16299L6.34782 21.3724C6.34782 21.3752 6.34782 21.3779 6.3492 21.3807C6.35058 21.4 6.35334 21.4193 6.35748 21.4386C6.36161 21.4607 6.36575 21.4814 6.37265 21.5022C6.37817 21.5228 6.38506 21.5433 6.39334 21.5641C6.40024 21.5821 6.40851 21.5986 6.41679 21.6166C6.44575 21.6746 6.48299 21.7281 6.52713 21.7766C6.54093 21.7917 6.5561 21.8069 6.57127 21.8207C6.58644 21.8345 6.60299 21.8483 6.61955 21.8607C6.6361 21.8731 6.65265 21.8841 6.67058 21.8952C6.68713 21.9062 6.70506 21.916 6.72299 21.9255C6.72437 21.9269 6.72713 21.9283 6.72989 21.9283C6.74644 21.9366 6.76437 21.9448 6.7823 21.9517C6.80161 21.96 6.8223 21.9669 6.84299 21.9724C6.8623 21.9793 6.88299 21.9834 6.90506 21.9876C6.92437 21.9916 6.94368 21.9945 6.96437 21.9959C6.98644 21.9986 7.00989 22 7.03334 22H16.9671C16.9906 22 17.014 21.9986 17.0361 21.9959C17.0623 21.9931 17.0871 21.989 17.112 21.9834C17.1326 21.9793 17.1533 21.9739 17.174 21.9669C17.1823 21.9655 17.1892 21.9628 17.1961 21.9586C17.2113 21.9545 17.2264 21.949 17.2416 21.9407C17.2485 21.9394 17.254 21.9366 17.2595 21.9338C17.2761 21.9269 17.2913 21.9186 17.3064 21.909C17.3795 21.8676 17.4444 21.8138 17.4968 21.749C17.5106 21.7338 17.523 21.7172 17.534 21.7007C17.5437 21.6883 17.552 21.6746 17.5602 21.6592C17.5713 21.6414 17.5809 21.6234 17.5892 21.6041C17.592 21.5986 17.5947 21.5931 17.5961 21.5876C17.6058 21.5683 17.614 21.5476 17.6195 21.5269C17.6251 21.5117 17.6306 21.4966 17.6333 21.48C17.6375 21.4677 17.6402 21.4552 17.6416 21.4414C17.6471 21.4222 17.6499 21.4014 17.6513 21.3807C17.6526 21.3779 17.6526 21.3752 17.6526 21.3724L18.8375 8.34483H19.4485C19.8292 8.34483 20.1382 8.03586 20.1382 7.65517V5.17241C20.1382 4.79172 19.8292 4.48276 19.4485 4.48276ZM12.6899 10.1379V18.8276C12.6899 19.2083 12.3809 19.5172 12.0002 19.5172C11.6195 19.5172 11.3106 19.2083 11.3106 18.8276V10.1379C11.3106 9.75724 11.6195 9.44828 12.0002 9.44828C12.3809 9.44828 12.6899 9.75724 12.6899 10.1379ZM15.1726 10.1379V18.8276C15.1726 19.2083 14.8637 19.5172 14.483 19.5172C14.1023 19.5172 13.7933 19.2083 13.7933 18.8276V10.1379C13.7933 9.75724 14.1023 9.44828 14.483 9.44828C14.8637 9.44828 15.1726 9.75724 15.1726 10.1379ZM10.2071 10.1379V18.8276C10.2071 19.2083 9.89817 19.5172 9.51748 19.5172C9.13679 19.5172 8.82782 19.2083 8.82782 18.8276V10.1379C8.82782 9.75724 9.13679 9.44828 9.51748 9.44828C9.89817 9.44828 10.2071 9.75724 10.2071 10.1379Z" fill="#007B87"/>
                      </svg>
                      Discard this version
                    </button>
                    <button className="flex items-center bg-white text-[#007B87] px-3 py-3 ">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.75 12C16.7474 12.1504 16.6866 12.2939 16.5802 12.4002C16.4739 12.5065 16.3304 12.5674 16.18 12.57H12.57V16.18C12.57 16.3312 12.5099 16.4762 12.4031 16.583C12.2962 16.6899 12.1512 16.75 12 16.75C11.8488 16.75 11.7038 16.6899 11.597 16.583C11.4901 16.4762 11.43 16.3312 11.43 16.18V12.57H7.82C7.66883 12.57 7.52385 12.5099 7.41695 12.403C7.31006 12.2962 7.25 12.1512 7.25 12C7.25 11.8488 7.31006 11.7038 7.41695 11.5969C7.52385 11.4901 7.66883 11.43 7.82 11.43H11.43V7.82C11.43 7.66883 11.4901 7.52384 11.597 7.41695C11.7038 7.31005 11.8488 7.25 12 7.25C12.1512 7.25 12.2962 7.31005 12.4031 7.41695C12.5099 7.52384 12.57 7.66883 12.57 7.82V11.43H16.18C16.3304 11.4326 16.4739 11.4934 16.5802 11.5998C16.6866 11.7061 16.7474 11.8496 16.75 12ZM12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17316C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8078C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17316C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20.86C10.2477 20.86 8.53467 20.3404 7.07765 19.3668C5.62063 18.3933 4.48502 17.0095 3.81443 15.3906C3.14384 13.7716 2.96838 11.9902 3.31025 10.2715C3.65211 8.55283 4.49594 6.97413 5.73504 5.73503C6.97413 4.49594 8.55283 3.65211 10.2715 3.31024C11.9902 2.96838 13.7716 3.14383 15.3906 3.81443C17.0095 4.48502 18.3933 5.62063 19.3668 7.07765C20.3404 8.53467 20.86 10.2477 20.86 12C20.86 14.3498 19.9265 16.6034 18.265 18.265C16.6034 19.9265 14.3498 20.86 12 20.86Z" fill="#007B87"/>
                      </svg>
                      Use in Proposal
                    </button>
                  </div>
                </div>


                <div className="w-full flex justify-between py-4 px-6 bg-[#FFFFFF] no-underline">
        <Button
          variant="outline"
          onClick={() => handleTabChange('recap')}
          iconLeft={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.6808 19C14.3791 19 14.0787 18.8779 13.8593 18.6374L8.49001 12.7486C8.10335 12.3244 8.10335 11.6756 8.49001 11.2514L13.8593 5.36256C14.2728 4.90911 14.9757 4.87656 15.429 5.29C15.8825 5.70356 15.9149 6.40622 15.5016 6.85967L10.8147 12L15.5016 17.1403C15.9149 17.5938 15.8825 18.2964 15.429 18.71C15.216 18.9042 14.9479 19 14.6808 19Z" fill="#007B87"/>
            </svg>
          }
        >
          Intake Questionnaire Recap
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setActiveTab('proposal')}
          iconRight={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.51922 5C9.82089 5 10.1213 5.12211 10.3407 5.36256L15.71 11.2514C16.0967 11.6756 16.0967 12.3244 15.71 12.7486L10.3407 18.6374C9.92722 19.0909 9.22433 19.1234 8.771 18.71C8.31756 18.2964 8.28511 17.5938 8.69845 17.1403L13.3853 12L8.69845 6.85967C8.28511 6.40622 8.31756 5.70356 8.771 5.29C8.984 5.09578 9.25211 5 9.51922 5Z" fill="#007B87"/>
            </svg>
          }
        >
          Proposal
        </Button>
      </div>



              </div>
            )}
            
            {/* Proposal Tab */}
            {activeTab === 'proposal' && (
              <div className="space-y-6 p-6">
                <div className="w-full">
                  <h2 className="text-2xl font-semibold text-[#333333] mb-4">Proposal</h2>
                </div>
                
                {/* Quote Selection Section */}
                <div className="w-full bg-white border border-[#D8D8D8] rounded-lg shadow-md overflow-hidden">
                  <div className="flex justify-between items-center bg-white p-3 border-2 border-[#D8D8D8] shadow">
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
                    
                    <div className="mt-4 p-2">
                      <button className="flex items-center gap-2 bg-F5F8FA text-[#007B87] px-4 py-2 border-0 border-[#007B87] rounded text-sm font-bold">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M18 11C18.5523 11 19 11.4477 19 12C19 12.5128 18.614 12.9355 18.1166 12.9933L18 13H6C5.44772 13 5 12.5523 5 12C5 11.4872 5.38604 11.0645 5.88338 11.0067L6 11H18Z" fill="#007B87"/>
                        </svg>
                        Remove from proposal
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Checkboxes */}
                <div className="space-y-4 mt-6 text-sm">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="infoAccurate"
                      checked={confirmationChecks.infoAccurate}
                      onChange={() => handleCheckboxChange('infoAccurate')}
                      className="mt-1 mr-2 w-5 h-5"
                    />
                    <label htmlFor="infoAccurate" className="text-[#333333] p-1">
                      What has been entered is true to the best of my knowledge
                    </label>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={confirmationChecks.termsAccepted}
                      onChange={() => handleCheckboxChange('termsAccepted')}
                      className="mt-1 mr-2 h-5 w-5"
                    />
                    <label htmlFor="termsAccepted" className="text-[#333333] p-1">
                      I have read and understand the full proposal including terms and conditions
                    </label>
                  </div>
                </div>
                
                {/* Proposal Actions */}
                <div className="flex flex-wrap gap-4 mt-8 font-semibold">
                  <button className="flex items-center gap-2 bg-white text-[#007B87] px-6 py-3 border-0 border-[#007B87] rounded">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M21.3507 12.5192C21.7091 12.5192 22 12.8101 22 13.1685V20.1815C22 20.54 21.7091 20.8309 21.3507 20.8309H2.64935C2.29091 20.8309 2 20.54 2 20.1815V13.1685C2 12.8101 2.29091 12.5192 2.64935 12.5192C3.00779 12.5192 3.2987 12.8101 3.2987 13.1685V19.5322H20.7013V13.1685C20.7013 12.8101 20.9922 12.5192 21.3507 12.5192ZM12 3.16846C12.3585 3.16846 12.6494 3.4595 12.6494 3.81781V16.3633L16.6273 12.736C16.8922 12.4946 17.3026 12.5139 17.5442 12.7788C17.787 13.0438 17.7675 13.4543 17.5026 13.6959L12.5039 18.2543C12.5026 18.2555 12.5026 18.2568 12.5013 18.2568L12.4377 18.314C12.313 18.427 12.1572 18.4827 12 18.4827C11.8429 18.4827 11.687 18.427 11.5624 18.314L11.4987 18.2568C11.4974 18.2568 11.4974 18.2555 11.4961 18.2543L6.49742 13.6959C6.23248 13.4543 6.213 13.0438 6.45586 12.7788C6.69742 12.5139 7.10781 12.4946 7.37274 12.736L11.3507 16.3633V3.81781C11.3507 3.4595 11.6416 3.16846 12 3.16846Z" fill="#007B87"/>
                    </svg>
                    Download quote proposal
                  </button>
                  <button className="flex items-center gap-2 bg-white text-[#007B87] px-6 py-3 border-0 border-[#007B87] rounded">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M18.1322 8.82136L15.1791 5.86833L17.1093 3.93818L20.0623 6.89121L18.1322 8.82136ZM8.94069 18.0128L6.01496 15.0325L14.0439 7.00361L16.9969 9.95664L8.94069 18.0128ZM4.07196 19.9285L5.21207 16.5098L7.46016 18.7981L4.07196 19.9285ZM21.7661 6.3226L17.6777 2.23605C17.3646 1.92132 16.8556 1.92132 16.5425 2.23605L13.477 5.30149L4.32086 14.456C4.31443 14.4625 4.30801 14.4689 4.30319 14.4753C4.29356 14.4849 4.28392 14.493 4.2759 14.5026C4.25663 14.5203 4.23896 14.5395 4.22451 14.5588C4.21006 14.5749 4.19721 14.5924 4.18597 14.6104C4.15546 14.6536 4.12977 14.7001 4.10889 14.7515C4.10086 14.7676 4.09444 14.7868 4.08802 14.8045C4.08641 14.8077 4.08641 14.8093 4.08481 14.8127L4.07678 14.8366L2.04065 20.9434C2.03904 20.9466 2.03904 20.9482 2.03904 20.9514C2.03262 20.9707 2.0278 20.99 2.02298 21.0108C2.01656 21.0317 2.01335 21.051 2.01014 21.0719C2.00693 21.0927 2.00372 21.1138 2.00211 21.1345C1.9989 21.1859 1.9989 21.2373 2.00532 21.2888C2.00853 21.3208 2.01496 21.3513 2.02138 21.3819C2.02138 21.3819 2.02138 21.385 2.02298 21.3866C2.0278 21.4043 2.03262 21.4221 2.03904 21.4396C2.04225 21.446 2.04386 21.4524 2.04707 21.4605C2.05671 21.4861 2.06634 21.5118 2.07758 21.5374C2.08882 21.5616 2.10167 21.5873 2.11451 21.61C2.11773 21.6162 2.12094 21.6228 2.12575 21.6275C2.137 21.6451 2.14824 21.6629 2.16108 21.6788C2.17393 21.6965 2.18677 21.7126 2.20123 21.7286C2.28312 21.8218 2.3891 21.8972 2.51114 21.9454C2.5272 21.9518 2.54165 21.9568 2.55771 21.9615C2.59625 21.9743 2.63639 21.9841 2.67654 21.9904C2.71829 21.997 2.76004 22 2.80339 22C2.84514 22 2.8885 21.997 2.93025 21.9904C2.9704 21.9841 3.01054 21.9743 3.04908 21.9615C3.05229 21.9615 3.0555 21.9599 3.05711 21.9599L9.16229 19.9239C9.17834 19.9189 9.1928 19.9141 9.20725 19.9077C9.21688 19.9061 9.22491 19.9029 9.23455 19.898C9.23936 19.8966 9.24418 19.8948 9.249 19.8914C9.27951 19.8788 9.31002 19.8643 9.33732 19.8466C9.35016 19.8402 9.36301 19.8322 9.37585 19.8242C9.39352 19.8129 9.41118 19.8001 9.42724 19.7872C9.43366 19.7824 9.43848 19.7776 9.4449 19.7728C9.46096 19.7599 9.47702 19.7471 9.49147 19.7326C9.49789 19.7262 9.50432 19.7198 9.51074 19.7134L21.7661 7.45805C22.0792 7.14508 22.0792 6.63605 21.7661 6.3226Z" fill="#007B87"/>
                    </svg>
                    Add cover note
                  </button>
                  <button
                    disabled={!confirmationChecks.infoAccurate || !confirmationChecks.termsAccepted}
                    className={`border-2 border-[#007B87] rounded flex items-center gap-2 ${
                      confirmationChecks.infoAccurate && confirmationChecks.termsAccepted
                        ? 'bg-[#007B87] text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    } px-6 py-3 rounded`}
                    onClick={handleCreateProposal}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M20.7013 17.7771H3.2987V6.97836L11.5571 14.0316C11.5922 14.0641 11.6312 14.0926 11.6714 14.1162C11.6883 14.1265 11.7078 14.1368 11.726 14.1459C11.7896 14.1745 11.8571 14.1939 11.926 14.2004C11.9338 14.2017 11.9403 14.203 11.9481 14.203C11.9649 14.2043 11.9831 14.2056 12 14.2056C12.0247 14.2056 12.0494 14.2043 12.074 14.2004C12.0909 14.1991 12.1091 14.1965 12.126 14.1926C12.1299 14.1926 12.1351 14.1915 12.139 14.1901C12.1558 14.1873 12.1727 14.1823 12.1883 14.1771C12.2273 14.1667 12.2662 14.1511 12.3026 14.1316C12.3117 14.1265 12.3208 14.1212 12.3286 14.1162C12.361 14.0978 12.3922 14.0758 12.4221 14.0498L12.4429 14.0316L20.7013 6.97836V17.7771ZM19.5909 6.21862L12 12.7017L4.40909 6.21862H19.5909ZM21.9961 5.50304C21.9948 5.48486 21.9922 5.46668 21.9883 5.44849V5.4446C21.9857 5.43031 21.9818 5.41603 21.9779 5.40174C21.974 5.38356 21.9675 5.36538 21.961 5.34849C21.9558 5.33408 21.9507 5.31992 21.9442 5.30564C21.939 5.29265 21.9325 5.27966 21.9247 5.26667C21.9182 5.25369 21.9104 5.2407 21.9026 5.22771C21.8961 5.21603 21.8883 5.20564 21.8805 5.19382C21.8675 5.17577 21.8545 5.15888 21.8403 5.142C21.826 5.12642 21.8117 5.11213 21.7974 5.09784C21.7948 5.09525 21.7922 5.09265 21.7896 5.09135C21.7753 5.07836 21.761 5.06538 21.7468 5.05499C21.7429 5.05109 21.7377 5.04849 21.7325 5.0446C21.7156 5.03148 21.6974 5.01992 21.6792 5.0094C21.6649 5.00044 21.6507 4.99278 21.6351 4.98616C21.6338 4.98486 21.6312 4.98486 21.6299 4.98356C21.6247 4.98096 21.6195 4.97836 21.6143 4.97577C21.5948 4.96655 21.574 4.95888 21.5532 4.95239C21.5312 4.94447 21.5091 4.9394 21.487 4.93408C21.4429 4.92512 21.3974 4.91992 21.3507 4.91992H2.64935C2.6026 4.91992 2.55714 4.92512 2.51299 4.93408C2.49091 4.9394 2.46883 4.94447 2.44675 4.95239C2.42597 4.95888 2.40519 4.96655 2.38571 4.97577C2.38052 4.97836 2.37532 4.98096 2.37013 4.98356C2.35325 4.99005 2.33636 4.99901 2.32078 5.0094C2.3026 5.01992 2.28442 5.03148 2.26753 5.0446C2.24416 5.06018 2.22338 5.07836 2.2026 5.09784C2.18831 5.11213 2.17403 5.12642 2.15974 5.142C2.14545 5.15888 2.13247 5.17577 2.11948 5.19382C2.11169 5.20564 2.1039 5.21603 2.0974 5.22771C2.08961 5.2407 2.08182 5.25369 2.07532 5.26667C2.06753 5.27966 2.06104 5.29265 2.05584 5.30564C2.04935 5.31992 2.04416 5.33408 2.03896 5.34849C2.03247 5.36538 2.02597 5.38356 2.02208 5.40174C2.01818 5.41603 2.01429 5.43031 2.01169 5.4446C2.00779 5.46395 2.00519 5.48356 2.0039 5.50304C2.0013 5.52512 2 5.54719 2 5.56927V18.4264C2 18.7849 2.29091 19.0758 2.64935 19.0758H21.3507C21.7091 19.0758 22 18.7849 22 18.4264V5.56927C22 5.54719 21.9987 5.52512 21.9961 5.50304Z" fill="currentColor"/>
                    </svg>
                    Send Proposal
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
      
      {/* Button Bar - Full width spanning both sidebar and main content */}
      <div className="w-full flex justify-between py-4 px-6 bg-[#E6EEEF] no-underline">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          iconLeft={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.6808 19C14.3791 19 14.0787 18.8779 13.8593 18.6374L8.49001 12.7486C8.10335 12.3244 8.10335 11.6756 8.49001 11.2514L13.8593 5.36256C14.2728 4.90911 14.9757 4.87656 15.429 5.29C15.8825 5.70356 15.9149 6.40622 15.5016 6.85967L10.8147 12L15.5016 17.1403C15.9149 17.5938 15.8825 18.2964 15.429 18.71C15.216 18.9042 14.9479 19 14.6808 19Z" fill="#007B87"/>
            </svg>
          }
        >
          Coverage and Plan Design
        </Button>
        
        <Button
          variant="text"
          onClick={() => {
            // Reset all store states before starting a new submission
            handleSignoff();
            
            // Show notification about starting new submission
            setNotification({
              isVisible: true,
              message: 'Starting a new submission with fresh data.',
              type: 'info'
            });
            
            // Add a small delay before redirecting to allow the notification to be seen
            setTimeout(() => {
              router.push('/submission');
            }, 1500);
          }}
          className="bg-[#007B87] font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#005F69] hover:text-white"
        >
          Start New Submission
        </Button>
      </div>
      {/* Notification */}
      {notification.isVisible && (
        <Notification
          isVisible={notification.isVisible}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, isVisible: false })}
        />
      )}
    </div>
  );
}
