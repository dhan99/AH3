'use client';

import React, { useState } from 'react';
import useLossHistoryStore from '@/store/useLossHistoryStore';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import { Breadcrumb, ProgressStepper } from '@/components/submission';

// Main component
export default function LossHistoryPage() {
  const router = useRouter();
  const { isLoading, logout, user: authUser } = useMockAuth();
  
  // Get state and actions from the loss history store
  const {
    openSections,
    occupationalAccidentInPlace,
    nonTruckingLiabilityInPlace,
    vehiclePhysicalDamageInPlace,
    occupationalAccidentClaims,
    nonTruckingLiabilityClaims,
    vehiclePhysicalDamageClaims,
    dates,
    coveredData,
    claimsData,
    setOpenSection,
    setOccupationalAccidentInPlace,
    setNonTruckingLiabilityInPlace,
    setVehiclePhysicalDamageInPlace,
    setOccupationalAccidentClaims,
    setNonTruckingLiabilityClaims,
    setVehiclePhysicalDamageClaims,
    updateOccupationalAccidentDate,
    updateNonTruckingLiabilityDate,
    updateVehiclePhysicalDamageDate,
    updateOccupationalAccidentCoveredData,
    updateNonTruckingLiabilityCoveredData,
    updateVehiclePhysicalDamageCoveredData,
    updateOccupationalAccidentClaimsData,
    updateNonTruckingLiabilityClaimsData,
    updateVehiclePhysicalDamageClaimsData
  } = useLossHistoryStore();
  
  // Toggle accordion sections
  const toggleSection = (section: 'occupationalAccident' | 'nonTruckingLiability' | 'vehiclePhysicalDamage') => {
    setOpenSection(section, !openSections[section]);
  };
  
  // Navigation handlers
  const handlePreviousStep = () => router.push('/submission/eligibility');
  const handleNextStep = () => router.push('/submission/coverage-plan-driver');
  
  // Progress steps for sidebar
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
      isActive: true,
      isCompleted: false,
      subsections: [
        { title: 'Driver Agreements', isActive: false, isCompleted: true },
        { title: 'Vehicles', isActive: false, isCompleted: true },
        { title: 'Hauling', isActive: false, isCompleted: true },
        { title: 'Loss History', isActive: true }
      ]
    },
    {
      stepNumber: 3,
      title: 'Coverage and Plan Design',
      isActive: false,
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
  
  // Helper components
  const RadioGroup = ({
    name, 
    value, 
    onChange, 
    label,
    error,
  }: {
    name: string;
    value: string | null;
    onChange: (value: string) => void;
    label: string;
    error?: string;
  }) => {
    return (
      <div className="flex flex-col mb-4">
        <p className="text-base font-semibold text-[#333333] mb-4">{label}</p>
        <div className="flex gap-4">
          <label className={`flex items-center cursor-pointer p-3 border ${error ? 'border-[#C60C30]' : 'border-[#D8D8D8]'} rounded`}>
            <input 
              type="radio" 
              name={name} 
              value="yes" 
              checked={value === 'yes'}
              onChange={() => onChange('yes')}
              className="w-4 h-4 mr-2 text-[#007B87] border-gray-300"
            />
            <span className="text-[#333333]">Yes</span>
          </label>
          <label className={`flex items-center cursor-pointer p-3 border ${error ? 'border-[#C60C30]' : 'border-[#D8D8D8]'} rounded`}>
            <input 
              type="radio" 
              name={name} 
              value="no"
              checked={value === 'no'}
              onChange={() => onChange('no')}
              className="w-4 h-4 mr-2 text-[#007B87] border-gray-300"
            />
            <span className="text-[#333333]">No</span>
          </label>
        </div>
        {error && (
          <p className="text-[#C60C30] text-sm mt-1">{error}</p>
        )}
      </div>
    );
  };

  const DateInput = ({
    label,
    value,
    onChange,
    placeholder = "MM/DD/YYYY",
    error
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
  }) => {
    return (
      <div className="flex-1 min-w-[230px]">
        <label className="block text-base font-semibold text-[#333333] mb-1">
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border ${error ? 'border-[#C60C30]' : 'border-[#D8D8D8]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
        />
        {error && (
          <p className="text-[#C60C30] text-sm mt-1">{error}</p>
        )}
      </div>
    );
  };

  const YearInput = ({
    label,
    value,
    onChange,
    placeholder = "YYYY",
    error
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
  }) => {
    return (
      <div className="flex-1 min-w-[150px]">
        <label className="block text-base font-semibold text-[#333333] mb-1">
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={4}
          className={`w-full px-4 py-3 border ${error ? 'border-[#C60C30]' : 'border-[#D8D8D8]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
        />
        {error && (
          <p className="text-[#C60C30] text-sm mt-1">{error}</p>
        )}
      </div>
    );
  };
  
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
          <h1 className="text-3xl font-bold text-[#333333] mb-6">Eligibility</h1>
          
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
          
          {/* Loss History Section */}
          <div className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-4 bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
            >
              <h2 className="text-2xl font-semibold text-[#333333]">Loss History</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="transform transition-transform rotate-180"
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {/* Occupational Accident Section */}
            <div className="border border-[#D8D8D8] mb-6 bg-[#FFFFFF]">
              <button 
                className="flex justify-between items-center p-4 w-full"
                onClick={() => toggleSection('occupationalAccident')}
              >
                <h3 className="text-lg font-semibold text-[#333333]">Occupational Accident</h3>
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
                <div className="p-6">
                  <RadioGroup
                    name="occupationalAccident_inPlace"
                    value={occupationalAccidentInPlace}
                    onChange={setOccupationalAccidentInPlace}
                    label="Is Occupational Accident coverage currently in place?"
                    error=""
                  />
                  
                  {occupationalAccidentInPlace === 'yes' && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-4 mb-4">
                        <DateInput
                          label="Loss run evaluation date"
                          value={dates.occupationalAccident.lossRunEvaluation}
                          onChange={(value) => updateOccupationalAccidentDate('lossRunEvaluation', value)}
                        />
                        
                        <DateInput
                          label="Anniversary date"
                          value={dates.occupationalAccident.anniversary}
                          onChange={(value) => updateOccupationalAccidentDate('anniversary', value)}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-base font-semibold text-[#333333] mb-4">
                          Average number of covered lives
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <YearInput
                            label="Current policy year"
                            value={coveredData.occupationalAccident.current}
                            onChange={(value) => updateOccupationalAccidentCoveredData('current', value)}
                          />
                          
                          <YearInput
                            label="Prior policy year"
                            value={coveredData.occupationalAccident.prior}
                            onChange={(value) => updateOccupationalAccidentCoveredData('prior', value)}
                          />
                          
                          <YearInput
                            label="3rd policy year"
                            value={coveredData.occupationalAccident.third}
                            onChange={(value) => updateOccupationalAccidentCoveredData('third', value)}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <RadioGroup
                          name="occupationalAccident_claims"
                          value={occupationalAccidentClaims}
                          onChange={setOccupationalAccidentClaims}
                          label="Have there been any claims?"
                          error=""
                        />
                      </div>
                      
                      {occupationalAccidentClaims === 'yes' && (
                        <div className="pl-4 mb-6">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[230px]">
                              <label className="block text-base font-semibold text-[#333333] mb-1">
                                Number of incurred claims
                              </label>
                              <input
                                type="text"
                                value={claimsData.occupationalAccident.incurred}
                                onChange={(e) => updateOccupationalAccidentClaimsData('incurred', e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-3 border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-[230px]">
                              <label className="block text-base font-semibold text-[#333333] mb-1">
                                Total losses paid
                              </label>
                              <input
                                type="text"
                                value={claimsData.occupationalAccident.totalLosses}
                                onChange={(e) => updateOccupationalAccidentClaimsData('totalLosses', e.target.value)}
                                placeholder="$0.00"
                                className="w-full px-4 py-3 border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Non-Trucking Liability Section */}
            <div className="border border-[#D8D8D8] mb-6 bg-[#FFFFFF]">
              <button 
                className="flex justify-between items-center p-4 w-full"
                onClick={() => toggleSection('nonTruckingLiability')}
              >
                <h3 className="text-lg font-semibold text-[#333333]">Non-Trucking Liability</h3>
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
                <div className="p-6">
                  <RadioGroup
                    name="nonTruckingLiability_inPlace"
                    value={nonTruckingLiabilityInPlace}
                    onChange={setNonTruckingLiabilityInPlace}
                    label="Is Non-Trucking Liability coverage currently in place?"
                    error=""
                  />
                  
                  {nonTruckingLiabilityInPlace === 'yes' && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-4 mb-4">
                        <DateInput
                          label="Loss run evaluation date"
                          value={dates.nonTruckingLiability.lossRunEvaluation}
                          onChange={(value) => updateNonTruckingLiabilityDate('lossRunEvaluation', value)}
                        />
                        
                        <DateInput
                          label="Anniversary date"
                          value={dates.nonTruckingLiability.anniversary}
                          onChange={(value) => updateNonTruckingLiabilityDate('anniversary', value)}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-base font-semibold text-[#333333] mb-4">
                          Average number of covered units
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <YearInput
                            label="Current policy year"
                            value={coveredData.nonTruckingLiability.current}
                            onChange={(value) => updateNonTruckingLiabilityCoveredData('current', value)}
                          />
                          
                          <YearInput
                            label="Prior policy year"
                            value={coveredData.nonTruckingLiability.prior}
                            onChange={(value) => updateNonTruckingLiabilityCoveredData('prior', value)}
                          />
                          
                          <YearInput
                            label="3rd policy year"
                            value={coveredData.nonTruckingLiability.third}
                            onChange={(value) => updateNonTruckingLiabilityCoveredData('third', value)}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <RadioGroup
                          name="nonTruckingLiability_claims"
                          value={nonTruckingLiabilityClaims}
                          onChange={setNonTruckingLiabilityClaims}
                          label="Have there been any claims?"
                          error=""
                        />
                      </div>
                      
                      {nonTruckingLiabilityClaims === 'yes' && (
                        <div className="pl-4 mb-6">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[230px]">
                              <label className="block text-base font-semibold text-[#333333] mb-1">
                                Number of incurred claims
                              </label>
                              <input
                                type="text"
                                value={claimsData.nonTruckingLiability.incurred}
                                onChange={(e) => updateNonTruckingLiabilityClaimsData('incurred', e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-3 border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-[230px]">
                              <label className="block text-base font-semibold text-[#333333] mb-1">
                                Total losses paid
                              </label>
                              <input
                                type="text"
                                value={claimsData.nonTruckingLiability.totalLosses}
                                onChange={(e) => updateNonTruckingLiabilityClaimsData('totalLosses', e.target.value)}
                                placeholder="$0.00"
                                className="w-full px-4 py-3 border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Vehicle Physical Damage Section */}
            <div className="border border-[#D8D8D8] mb-6 bg-[#FFFFFF]">
              <button 
                className="flex justify-between items-center p-4 w-full"
                onClick={() => toggleSection('vehiclePhysicalDamage')}
              >
                <h3 className="text-lg font-semibold text-[#333333]">Vehicle Physical Damage</h3>
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
                <div className="p-6">
                  <RadioGroup
                    name="vehiclePhysicalDamage_inPlace"
                    value={vehiclePhysicalDamageInPlace}
                    onChange={setVehiclePhysicalDamageInPlace}
                    label="Is current Vehicle Physical Damage coverage in place?"
                    error=""
                  />
                  
                  {vehiclePhysicalDamageInPlace === 'yes' && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-4 mb-4">
                        <DateInput
                          label="Inception date"
                          value={dates.vehiclePhysicalDamage.inception}
                          onChange={(value) => updateVehiclePhysicalDamageDate('inception', value)}
                        />
                        
                        <DateInput
                          label="Loss run evaluation date"
                          value={dates.vehiclePhysicalDamage.lossRunEvaluation}
                          onChange={(value) => updateVehiclePhysicalDamageDate('lossRunEvaluation', value)}
                        />
                        
                        <DateInput
                          label="Anniversary date"
                          value={dates.vehiclePhysicalDamage.anniversary}
                          onChange={(value) => updateVehiclePhysicalDamageDate('anniversary', value)}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-base font-semibold text-[#333333] mb-4">
                          Average TIV per policy year
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <YearInput
                            label="Current policy year"
                            value={coveredData.vehiclePhysicalDamage.current}
                            onChange={(value) => updateVehiclePhysicalDamageCoveredData('current', value)}
                          />
                          
                          <YearInput
                            label="Prior policy year"
                            value={coveredData.vehiclePhysicalDamage.prior}
                            onChange={(value) => updateVehiclePhysicalDamageCoveredData('prior', value)}
                          />
                          
                          <YearInput
                            label="3rd policy year"
                            value={coveredData.vehiclePhysicalDamage.third}
                            onChange={(value) => updateVehiclePhysicalDamageCoveredData('third', value)}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <RadioGroup
                          name="vehiclePhysicalDamage_claims"
                          value={vehiclePhysicalDamageClaims}
                          onChange={setVehiclePhysicalDamageClaims}
                          label="Have there been any claims?"
                          error=""
                        />
                      </div>
                      
                      {vehiclePhysicalDamageClaims === 'yes' && (
                        <div className="pl-4 mb-6">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[230px]">
                              <label className="block text-base font-semibold text-[#333333] mb-1">
                                Number of incurred claims
                              </label>
                              <input
                                type="text"
                                value={claimsData.vehiclePhysicalDamage.incurred}
                                onChange={(e) => updateVehiclePhysicalDamageClaimsData('incurred', e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-3 border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-[230px]">
                              <label className="block text-base font-semibold text-[#333333] mb-1">
                                Total losses paid
                              </label>
                              <input
                                type="text"
                                value={claimsData.vehiclePhysicalDamage.totalLosses}
                                onChange={(e) => updateVehiclePhysicalDamageClaimsData('totalLosses', e.target.value)}
                                placeholder="$0.00"
                                className="w-full px-4 py-3 border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Button Bar */}
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
