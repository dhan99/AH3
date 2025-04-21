'use client';

import React, { useState } from 'react';
import useLossHistoryStore from '@/store/useLossHistoryStore';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import { Breadcrumb, ProgressStepper } from '@/components/submission';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '@/components/ui/Button';

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
  
  // Helper function to parse date strings
  const parseDate = (dateString: string) => {
    if (!dateString) return null;
    
    // Parse MM/DD/YYYY format
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1; // months are 0-indexed in JS Date
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    
    return null;
  };
  
  // Helper function to format dates
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  };
  
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
  
  // Date input with date picker
  const DateInput = ({
    id,
    label,
    value,
    onChange,
    error
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
  }) => {
    // Create an uncontrolled component that maintains focus while typing
    const UncontrolledDateInput = () => {
      const [localDate, setLocalDate] = React.useState<Date | null>(parseDate(value));
      
      // Update local state without triggering parent updates during typing
      const handleDateChange = (date: Date | null) => {
        setLocalDate(date);
      };
      
      // Only update parent state on close/blur to prevent focus loss
      const handleCalendarClose = () => {
        onChange(formatDate(localDate));
      };
      
      // Sync with parent value when it changes externally
      React.useEffect(() => {
        const parsedDate = parseDate(value);
        if (parsedDate && (!localDate || parsedDate.getTime() !== localDate.getTime())) {
          setLocalDate(parsedDate);
        }
      }, [value]);
      
      return (
        <DatePicker
          id={id}
          selected={localDate}
          onChange={handleDateChange}
          onCalendarClose={handleCalendarClose}
          onBlur={() => onChange(formatDate(localDate))}
          dateFormat="MM/dd/yyyy"
          placeholderText="MM/DD/YYYY"
          className={`w-full px-4 py-3 border ${error ? 'border-[#C60C30]' : 'border-[#D8D8D8]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
          showPopperArrow={false}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          popperClassName="react-datepicker-popper"
          popperPlacement="bottom-start"
        />
      );
    };
    
    return (
      <div className="flex-1 min-w-[230px]">
        <label htmlFor={id} className="block text-base font-semibold text-[#333333] mb-1">
          {label}
        </label>
        <UncontrolledDateInput />
        {error && (
          <p className="text-[#C60C30] text-sm mt-1">{error}</p>
        )}
      </div>
    );
  };

  // Helper function to parse year strings
  const parseYear = (yearString: string) => {
    if (!yearString) return null;
    
    const year = parseInt(yearString, 10);
    if (!isNaN(year)) {
      const date = new Date();
      date.setFullYear(year);
      return date;
    }
    
    return null;
  };
  
  // Helper function to format years
  const formatYear = (date: Date | null) => {
    if (!date) return '';
    return date.getFullYear().toString();
  };
  
  // Year input component with year picker widget
  const YearInput = ({
    id,
    label,
    value,
    onChange,
    placeholder = "YYYY",
    error
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
  }) => {
    // Get current year for range calculation
    const currentYear = new Date().getFullYear();
    
    // Create an uncontrolled component that maintains focus while typing
    const UncontrolledYearInput = () => {
      const [localYear, setLocalYear] = React.useState<Date | null>(parseYear(value));
      
      // Update local state without triggering parent updates during typing
      const handleYearChange = (date: Date | null) => {
        setLocalYear(date);
      };
      
      // Only update parent state on close/blur to prevent focus loss
      const handleCalendarClose = () => {
        onChange(formatYear(localYear));
      };
      
      // Sync with parent value when it changes externally
      React.useEffect(() => {
        const parsedYear = parseYear(value);
        if (parsedYear && (!localYear || parsedYear.getFullYear() !== localYear.getFullYear())) {
          setLocalYear(parsedYear);
        }
      }, [value]);
      
      return (
        <DatePicker
          id={id}
          selected={localYear}
          onChange={handleYearChange}
          onCalendarClose={handleCalendarClose}
          onBlur={() => onChange(formatYear(localYear))}
          showYearPicker
          dateFormat="yyyy"
          yearItemNumber={12}
          placeholderText={placeholder}
          className={`w-full px-4 py-3 border ${error ? 'border-[#C60C30]' : 'border-[#D8D8D8]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
          minDate={new Date(currentYear - 20, 0, 1)}
          maxDate={new Date(currentYear + 1, 11, 31)}
          showPopperArrow={false}
          popperClassName="react-datepicker-popper"
          popperPlacement="bottom-start"
        />
      );
    };
    
    return (
      <div className="flex-1 min-w-[150px]">
        <label htmlFor={id} className="block text-base font-semibold text-[#333333] mb-1">
          {label}
        </label>
        <UncontrolledYearInput />
        {error && (
          <p className="text-[#C60C30] text-sm mt-1">{error}</p>
        )}
      </div>
    );
  };
  
  // Claims input field with input validation - using native number inputs to maintain focus
  const ClaimsInput = ({ 
    id,
    label, 
    value, 
    onChange, 
    placeholder, 
    className = "w-full px-4 py-3 border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]",
    type = "text"
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    type?: "number" | "currency" | "text";
  }) => {
    // For numeric fields, use an uncontrolled component approach similar to currency
    if (type === "number") {
      // Create a separate component that doesn't use React's value prop
      const UncontrolledNumberInput = () => {
        // Get the input ref to set the value manually
        const inputRef = React.useRef<HTMLInputElement>(null);
        
        // Set initial value on mount and add input validation
        React.useEffect(() => {
          if (inputRef.current) {
            // Set initial value
            inputRef.current.value = value;
            
            // Add input event listener for real-time validation without losing focus
            const input = inputRef.current;
            const validateInput = (e: Event) => {
              const target = e.target as HTMLInputElement;
              const cursorPosition = target.selectionStart;
              
              // Only allow numeric digits
              const sanitized = target.value.replace(/[^\d]/g, '');
              
              // Only update if changed to avoid focus issues
              if (sanitized !== target.value) {
                target.value = sanitized;
                // Try to maintain cursor position
                setTimeout(() => {
                  const newPosition = Math.min(cursorPosition || 0, sanitized.length);
                  target.setSelectionRange(newPosition, newPosition);
                }, 0);
              }
            };
            
            input.addEventListener('input', validateInput);
            
            // Clean up
            return () => {
              input.removeEventListener('input', validateInput);
            };
          }
        }, []);
        
        // Update parent state on blur
        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        };
        
        return (
          <input
            ref={inputRef}
            id={id}
            type="text"
            defaultValue={value}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={className}
            inputMode="numeric"
          />
        );
      };
      
      return (
        <div className="flex-1 min-w-[230px]">
          <label htmlFor={id} className="block text-base font-semibold text-[#333333] mb-1">
            {label}
          </label>
          <UncontrolledNumberInput />
        </div>
      );
    }
    
    // For currency fields, use a completely uncontrolled component approach
    if (type === "currency") {
      // Create a separate component that doesn't use React's value prop
      const UncontrolledCurrencyInput = () => {
        // Get the input ref to set the value manually
        const inputRef = React.useRef<HTMLInputElement>(null);
        
        // Set initial value on mount and add input validation
        React.useEffect(() => {
          if (inputRef.current) {
            // Strip $ when setting initial value
            inputRef.current.value = value.replace(/^\$/, '');
            
            // Add input event listener for real-time validation without losing focus
            const input = inputRef.current;
            const validateInput = (e: Event) => {
              const target = e.target as HTMLInputElement;
              const cursorPosition = target.selectionStart;
              
              // Validate for currency format (numbers, single decimal point)
              // Replace any invalid characters
              const sanitized = target.value.replace(/[^\d.]/g, '');
              
              // Ensure only one decimal point
              const parts = sanitized.split('.');
              let formatted = parts[0];
              if (parts.length > 1) {
                // Keep only up to 2 decimal places
                formatted += '.' + parts.slice(1).join('').substring(0, 2);
              }
              
              // Only update if changed to avoid focus issues
              if (formatted !== target.value) {
                target.value = formatted;
                // Try to maintain cursor position
                setTimeout(() => {
                  const newPosition = Math.min(cursorPosition || 0, formatted.length);
                  target.setSelectionRange(newPosition, newPosition);
                }, 0);
              }
            };
            
            input.addEventListener('input', validateInput);
            
            // Clean up
            return () => {
              input.removeEventListener('input', validateInput);
            };
          }
        }, []);
        
        // Format number with commas for display when blurring
        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
          if (!e.target.value) {
            onChange('$0.00');
            return;
          }
          
          // Format with commas and always two decimal places
          let value = e.target.value;
          
          // Ensure there's a decimal point with exactly two places
          if (!value.includes('.')) {
            value += '.00';
          } else {
            const parts = value.split('.');
            // Pad with zeros if needed
            value = parts[0] + '.' + (parts[1] + '00').substring(0, 2);
          }
          
          // Add dollar sign for storage
          onChange('$' + value);
        };
        
        return (
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              ref={inputRef}
              id={id}
              type="text"
              defaultValue={value.replace(/^\$/, '')}
              onBlur={handleBlur}
              placeholder={placeholder ? placeholder.replace('$', '') : '0.00'}
              className={`${className} pl-7`}
              inputMode="decimal"
            />
          </div>
        );
      };
      
      return (
        <div className="flex-1 min-w-[230px]">
          <label htmlFor={id} className="block text-base font-semibold text-[#333333] mb-1">
            {label}
          </label>
          <UncontrolledCurrencyInput />
        </div>
      );
    }
    
    // For regular text
    return (
      <div className="flex-1 min-w-[230px]">
        <label htmlFor={id} className="block text-base font-semibold text-[#333333] mb-1">
          {label}
        </label>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
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
      <Header user={authUser || {}} onLogout={logout} />
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex flex-row">
        <div className="min-w-[260px] shadow-sm bg-white">
          <ProgressStepper steps={steps} />
        </div>
        
        <div className="flex-1 p-8 bg-[#F9F8FB]">
          <h1 className="text-3xl font-bold text-[#333333] mb-6">Eligibility</h1>
          
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

          
          {/* Loss History Sections */}
          <div className="w-full mb-6">
            <button className="flex justify-between items-center p-4 bg-[#F9F8FB] border-b border-[#E6EEEF] w-full">
              <h2 className="text-2xl font-semibold text-[#333333]">Loss History</h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform rotate-180">
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {/* Occupational Accident Section */}
            <div className="border border-[#D8D8D8] mb-6 bg-[#FFFFFF]">
              <button className="flex justify-between items-center p-4 w-full" onClick={() => toggleSection('occupationalAccident')}>
                <h3 className="text-lg font-semibold text-[#333333]">Occupational Accident</h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform ${openSections.occupationalAccident ? 'rotate-180' : ''}`}>
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
                          id="oa-loss-run-date"
                          label="Loss run evaluation date"
                          value={dates.occupationalAccident.lossRunEvaluation}
                          onChange={(value) => updateOccupationalAccidentDate('lossRunEvaluation', value)}
                        />
                        
                        <DateInput
                          id="oa-anniversary-date"
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
                            id="oa-current-year"
                            label="Current policy year"
                            value={coveredData.occupationalAccident.current}
                            onChange={(value) => updateOccupationalAccidentCoveredData('current', value)}
                            placeholder="YYYY"
                          />
                          
                          <YearInput
                            id="oa-prior-year"
                            label="Prior policy year"
                            value={coveredData.occupationalAccident.prior}
                            onChange={(value) => updateOccupationalAccidentCoveredData('prior', value)}
                            placeholder="YYYY"
                          />
                          
                          <YearInput
                            id="oa-third-year"
                            label="3rd policy year"
                            value={coveredData.occupationalAccident.third}
                            onChange={(value) => updateOccupationalAccidentCoveredData('third', value)}
                            placeholder="YYYY"
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
                            <ClaimsInput
                              id="oa-claims-incurred"
                              label="Number of incurred claims"
                              value={claimsData.occupationalAccident.incurred}
                              onChange={(value) => updateOccupationalAccidentClaimsData('incurred', value)}
                              placeholder="0"
                              type="number"
                            />
                            
                            <ClaimsInput
                              id="oa-claims-losses"
                              label="Total losses paid"
                              value={claimsData.occupationalAccident.totalLosses}
                              onChange={(value) => updateOccupationalAccidentClaimsData('totalLosses', value)}
                              placeholder="$0.00"
                              type="currency"
                            />
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
              <button className="flex justify-between items-center p-4 w-full" onClick={() => toggleSection('nonTruckingLiability')}>
                <h3 className="text-lg font-semibold text-[#333333]">Non-Trucking Liability</h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform ${openSections.nonTruckingLiability ? 'rotate-180' : ''}`}>
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
                          id="ntl-loss-run-date"
                          label="Loss run evaluation date"
                          value={dates.nonTruckingLiability.lossRunEvaluation}
                          onChange={(value) => updateNonTruckingLiabilityDate('lossRunEvaluation', value)}
                        />
                        
                        <DateInput
                          id="ntl-anniversary-date"
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
                            id="ntl-current-year"
                            label="Current policy year"
                            value={coveredData.nonTruckingLiability.current}
                            onChange={(value) => updateNonTruckingLiabilityCoveredData('current', value)}
                            placeholder="YYYY"
                          />
                          
                          <YearInput
                            id="ntl-prior-year"
                            label="Prior policy year"
                            value={coveredData.nonTruckingLiability.prior}
                            onChange={(value) => updateNonTruckingLiabilityCoveredData('prior', value)}
                            placeholder="YYYY"
                          />
                          
                          <YearInput
                            id="ntl-third-year"
                            label="3rd policy year"
                            value={coveredData.nonTruckingLiability.third}
                            onChange={(value) => updateNonTruckingLiabilityCoveredData('third', value)}
                            placeholder="YYYY"
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
                            <ClaimsInput
                              id="ntl-claims-incurred"
                              label="Number of incurred claims"
                              value={claimsData.nonTruckingLiability.incurred}
                              onChange={(value) => updateNonTruckingLiabilityClaimsData('incurred', value)}
                              placeholder="0"
                              type="number"
                            />
                            
                            <ClaimsInput
                              id="ntl-claims-losses"
                              label="Total losses paid"
                              value={claimsData.nonTruckingLiability.totalLosses}
                              onChange={(value) => updateNonTruckingLiabilityClaimsData('totalLosses', value)}
                              placeholder="$0.00"
                              type="currency"
                            />
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
              <button className="flex justify-between items-center p-4 w-full" onClick={() => toggleSection('vehiclePhysicalDamage')}>
                <h3 className="text-lg font-semibold text-[#333333]">Vehicle Physical Damage</h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform ${openSections.vehiclePhysicalDamage ? 'rotate-180' : ''}`}>
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
                          id="vpd-inception-date"
                          label="Inception date"
                          value={dates.vehiclePhysicalDamage.inception}
                          onChange={(value) => updateVehiclePhysicalDamageDate('inception', value)}
                        />
                        
                        <DateInput
                          id="vpd-loss-run-date"
                          label="Loss run evaluation date"
                          value={dates.vehiclePhysicalDamage.lossRunEvaluation}
                          onChange={(value) => updateVehiclePhysicalDamageDate('lossRunEvaluation', value)}
                        />
                        
                        <DateInput
                          id="vpd-anniversary-date"
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
                            id="vpd-current-year"
                            label="Current policy year"
                            value={coveredData.vehiclePhysicalDamage.current}
                            onChange={(value) => updateVehiclePhysicalDamageCoveredData('current', value)}
                            placeholder="YYYY"
                          />
                          
                          <YearInput
                            id="vpd-prior-year"
                            label="Prior policy year"
                            value={coveredData.vehiclePhysicalDamage.prior}
                            onChange={(value) => updateVehiclePhysicalDamageCoveredData('prior', value)}
                            placeholder="YYYY"
                          />
                          
                          <YearInput
                            id="vpd-third-year"
                            label="3rd policy year"
                            value={coveredData.vehiclePhysicalDamage.third}
                            onChange={(value) => updateVehiclePhysicalDamageCoveredData('third', value)}
                            placeholder="YYYY"
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
                            <ClaimsInput
                              id="vpd-claims-incurred"
                              label="Number of incurred claims"
                              value={claimsData.vehiclePhysicalDamage.incurred}
                              onChange={(value) => updateVehiclePhysicalDamageClaimsData('incurred', value)}
                              placeholder="0"
                              type="number"
                            />
                            
                            <ClaimsInput
                              id="vpd-claims-losses"
                              label="Total losses paid"
                              value={claimsData.vehiclePhysicalDamage.totalLosses}
                              onChange={(value) => updateVehiclePhysicalDamageClaimsData('totalLosses', value)}
                              placeholder="$0.00"
                              type="currency"
                            />
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
          Eligibility
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
          Coverage and Plan Design
        </Button>
      </div>
    </div>
  );
}
