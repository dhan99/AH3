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
  
  // Section-specific date handlers
  const handleOccupationalAccidentDateChange = (
    field: 'lossRunEvaluation' | 'anniversary',
    value: string
  ) => {
    updateOccupationalAccidentDate(field, value);
  };
  
  const handleNonTruckingLiabilityDateChange = (
    field: 'lossRunEvaluation' | 'anniversary',
    value: string
  ) => {
    updateNonTruckingLiabilityDate(field, value);
  };
  
  const handleVehiclePhysicalDamageDateChange = (
    field: 'lossRunEvaluation' | 'anniversary' | 'inception',
    value: string
  ) => {
    updateVehiclePhysicalDamageDate(field, value);
  };
  
  // Section-specific covered data handlers
  const handleOccupationalAccidentCoveredDataChange = (
    field: 'current' | 'prior' | 'third',
    value: string
  ) => {
    updateOccupationalAccidentCoveredData(field, value);
  };
  
  const handleNonTruckingLiabilityCoveredDataChange = (
    field: 'current' | 'prior' | 'third',
    value: string
  ) => {
    updateNonTruckingLiabilityCoveredData(field, value);
  };
  
  const handleVehiclePhysicalDamageCoveredDataChange = (
    field: 'current' | 'prior' | 'third',
    value: string
  ) => {
    updateVehiclePhysicalDamageCoveredData(field, value);
  };
  
  // Section-specific claims data handlers
  const handleOccupationalAccidentClaimsDataChange = (
    field: 'incurred' | 'totalLosses',
    value: string
  ) => {
    updateOccupationalAccidentClaimsData(field, value);
  };
  
  const handleNonTruckingLiabilityClaimsDataChange = (
    field: 'incurred' | 'totalLosses',
    value: string
  ) => {
    updateNonTruckingLiabilityClaimsData(field, value);
  };
  
  const handleVehiclePhysicalDamageClaimsDataChange = (
    field: 'incurred' | 'totalLosses',
    value: string
  ) => {
    updateVehiclePhysicalDamageClaimsData(field, value);
  };
  
  // Navigation handlers
  const handlePreviousStep = () => router.push('/submission/eligibility');
  
  // Function to validate the Occupational Accident section
  const validateOccupationalAccident = () => {
    // Validation errors
    const errors: Record<string, string> = {};
    
    // Validate 'inPlace' radio selection
    if (!occupationalAccidentInPlace) {
      errors.inPlace = "Please select whether Occupational Accident coverage is currently in place";
      return { valid: Object.keys(errors).length === 0, errors };
    }
    
    // If "No" is selected, skip other validations and return valid
    if (occupationalAccidentInPlace === 'no') {
      return { valid: true, errors: {} };
    }
    
    // If "Yes" is selected for inPlace, validate required fields
    if (occupationalAccidentInPlace === 'yes') {
      // Validate date fields
      if (!dates.occupationalAccident.lossRunEvaluation) {
        errors.lossRunEvaluation = "Loss run evaluation date is required";
      } else if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(dates.occupationalAccident.lossRunEvaluation)) {
        errors.lossRunEvaluation = "Please enter a valid date in MM/DD/YYYY format";
      }
      
      if (!dates.occupationalAccident.anniversary) {
        errors.anniversary = "Anniversary date is required";
      } else if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(dates.occupationalAccident.anniversary)) {
        errors.anniversary = "Please enter a valid date in MM/DD/YYYY format";
      }
      
      // Validate current policy year (required)
      if (!coveredData.occupationalAccident.current) {
        errors.current = "Current policy year is required";
      } else if (!/^\d{4}$/.test(coveredData.occupationalAccident.current)) {
        errors.current = "Please enter a valid year in YYYY format";
      }
      
      // Validate prior and 3rd policy years if provided (optional fields)
      if (coveredData.occupationalAccident.prior && 
          !/^\d{4}$/.test(coveredData.occupationalAccident.prior)) {
        errors.prior = "Please enter a valid year in YYYY format";
      }
      
      if (coveredData.occupationalAccident.third && 
          !/^\d{4}$/.test(coveredData.occupationalAccident.third)) {
        errors.third = "Please enter a valid year in YYYY format";
      }
    
      // Validate 'claims' radio selection
      if (!occupationalAccidentClaims) {
        errors.claims = "Please select whether there have been any claims";
      }
      
      // If "Yes" is selected for claims, validate required fields
      if (occupationalAccidentClaims === 'yes') {
        // Validate incurred claims (must be a number)
        if (!claimsData.occupationalAccident.incurred) {
          errors.incurred = "Number of incurred claims is required";
        } else if (!/^\d+$/.test(claimsData.occupationalAccident.incurred)) {
          errors.incurred = "Please enter a valid number";
        }
        
        // Validate total losses (must be a currency amount)
        if (!claimsData.occupationalAccident.totalLosses) {
          errors.totalLosses = "Total losses paid is required";
        } else if (!/^\$?[\d,]+(\.\d{0,2})?$/.test(claimsData.occupationalAccident.totalLosses)) {
          errors.totalLosses = "Please enter a valid currency amount";
        }
      }
    }
    
    return { valid: Object.keys(errors).length === 0, errors };
  };
  
  // Function to validate the Non-Trucking Liability section
  const validateNonTruckingLiability = () => {
    const errors: Record<string, string> = {};
    
    if (!nonTruckingLiabilityInPlace) {
      errors.inPlace = "Please select whether Non-Trucking Liability coverage is currently in place";
      return { valid: Object.keys(errors).length === 0, errors };
    }
    
    // If "No" is selected, skip other validations and return valid
    if (nonTruckingLiabilityInPlace === 'no') {
      return { valid: true, errors: {} };
    }
    
    // If "Yes" is selected for inPlace, validate required fields
    if (nonTruckingLiabilityInPlace === 'yes') {
      // Validate date fields
      if (!dates.nonTruckingLiability.lossRunEvaluation) {
        errors.lossRunEvaluation = "Loss run evaluation date is required";
      } else if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(dates.nonTruckingLiability.lossRunEvaluation)) {
        errors.lossRunEvaluation = "Please enter a valid date in MM/DD/YYYY format";
      }
      
      if (!dates.nonTruckingLiability.anniversary) {
        errors.anniversary = "Anniversary date is required";
      } else if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(dates.nonTruckingLiability.anniversary)) {
        errors.anniversary = "Please enter a valid date in MM/DD/YYYY format";
      }
    }
    
    return { valid: Object.keys(errors).length === 0, errors };
  };
  
  // Function to validate the Vehicle Physical Damage section
  const validateVehiclePhysicalDamage = () => {
    const errors: Record<string, string> = {};
    
    if (!vehiclePhysicalDamageInPlace) {
      errors.inPlace = "Please select whether Vehicle Physical Damage coverage is currently in place";
      return { valid: Object.keys(errors).length === 0, errors };
    }
    
    // If "No" is selected, skip other validations and return valid
    if (vehiclePhysicalDamageInPlace === 'no') {
      return { valid: true, errors: {} };
    }
    
    // If "Yes" is selected for inPlace, validate required fields
    if (vehiclePhysicalDamageInPlace === 'yes') {
      // Validate date fields
      if (!dates.vehiclePhysicalDamage.inception) {
        errors.inception = "Inception date is required";
      } else if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(dates.vehiclePhysicalDamage.inception)) {
        errors.inception = "Please enter a valid date in MM/DD/YYYY format";
      }
      
      if (!dates.vehiclePhysicalDamage.lossRunEvaluation) {
        errors.lossRunEvaluation = "Loss run evaluation date is required";
      } else if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(dates.vehiclePhysicalDamage.lossRunEvaluation)) {
        errors.lossRunEvaluation = "Please enter a valid date in MM/DD/YYYY format";
      }
      
      if (!dates.vehiclePhysicalDamage.anniversary) {
        errors.anniversary = "Anniversary date is required";
      } else if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(dates.vehiclePhysicalDamage.anniversary)) {
        errors.anniversary = "Please enter a valid date in MM/DD/YYYY format";
      }
    }
    
    return { valid: Object.keys(errors).length === 0, errors };
  };
  
  // State to track validation errors for each section
  const [validationErrors, setValidationErrors] = useState({
    occupationalAccident: { valid: true, errors: {} as Record<string, string> },
    nonTruckingLiability: { valid: true, errors: {} as Record<string, string> },
    vehiclePhysicalDamage: { valid: true, errors: {} as Record<string, string> }
  });
  
  // Validate single field and update error state
  const validateField = (section: 'occupationalAccident' | 'nonTruckingLiability' | 'vehiclePhysicalDamage', field: string) => {
    let validationResult;
    
    // Based on the section, run the appropriate validation function
    if (section === 'occupationalAccident') {
      validationResult = validateOccupationalAccident();
    } else if (section === 'nonTruckingLiability') {
      validationResult = validateNonTruckingLiability();
    } else {
      validationResult = validateVehiclePhysicalDamage();
    }
    
    // Update error state with the result
    setValidationErrors(prev => ({
      ...prev,
      [section]: validationResult
    }));
    
    return validationResult;
  };
  
  // Modified to add validation for all sections
  const handleNextStep = () => {
    // First check driver agreements from eligibility page
    const eligibilityStore = require('@/store/useEligibilityStore').default;
    const { driverLeaseAgreement, independentContractors } = eligibilityStore.getState();
    
    // Validation error messages
    let validationMessage = '';
    
    // Validate that both radio options from eligibility page are selected
    if (!driverLeaseAgreement || driverLeaseAgreement === 'null') {
      validationMessage += 'Please select whether drivers sign an independent contractor lease agreement.\n';
    }
    
    if (!independentContractors || independentContractors === 'null') {
      validationMessage += 'Please select whether independent contractors operate equipment without a vehicle lease agreement.\n';
    }
    
    if (validationMessage) {
      // Show error message
      alert("Driver Agreements validation failed:\n" + validationMessage + "\nPlease go back to the Eligibility page and complete the Driver Agreements section.");
      return;
    }
    
    // Validate each section of the Loss History page
    const occupationalAccidentValidation = validateOccupationalAccident();
    const nonTruckingLiabilityValidation = validateNonTruckingLiability();
    const vehiclePhysicalDamageValidation = validateVehiclePhysicalDamage();
    
    // Update validation errors state
    setValidationErrors({
      occupationalAccident: occupationalAccidentValidation,
      nonTruckingLiability: nonTruckingLiabilityValidation,
      vehiclePhysicalDamage: vehiclePhysicalDamageValidation
    });
    
    let hasValidationErrors = false;
    
    if (!occupationalAccidentValidation.valid) {
      hasValidationErrors = true;
      // Expand the section if it's closed and has errors
      if (!openSections.occupationalAccident) {
        setOpenSection('occupationalAccident', true);
      }
    }
    
    if (!nonTruckingLiabilityValidation.valid) {
      hasValidationErrors = true;
      // Expand the section if it's closed and has errors
      if (!openSections.nonTruckingLiability) {
        setOpenSection('nonTruckingLiability', true);
      }
    }
    
    if (!vehiclePhysicalDamageValidation.valid) {
      hasValidationErrors = true;
      // Expand the section if it's closed and has errors
      if (!openSections.vehiclePhysicalDamage) {
        setOpenSection('vehiclePhysicalDamage', true);
      }
    }
    
    if (hasValidationErrors) {
      // Scroll to the top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // If all validations pass, proceed to next step
    router.push('/submission/coverage-plan-driver');
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

  // Helper component for radio buttons
  const RadioGroup = ({
    name, 
    value, 
    onChange, 
    label,
    error,
    section
  }: {
    name: string;
    value: string | null;
    onChange: (value: string) => void;
    label: string;
    error?: string;
    section?: 'occupationalAccident' | 'nonTruckingLiability' | 'vehiclePhysicalDamage';
  }) => {
    // Remove setTimeout validation to prevent focus issues
    const handleChange = (selectedValue: string) => {
      onChange(selectedValue);
    };
    
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
              onChange={() => handleChange('yes')}
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
              onChange={() => handleChange('no')}
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

  // Helper component using plain HTML input to completely avoid React focus issues
  const InputField = ({
    label,
    value,
    onChange,
    placeholder = '',
    showInfoIcon = false,
    error,
    section,
    fieldName,
    isDateField = false,
    isYearField = false,
    isNumberField = false,
    isCurrencyField = false
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    showInfoIcon?: boolean;
    error?: string;
    section?: 'occupationalAccident' | 'nonTruckingLiability' | 'vehiclePhysicalDamage';
    fieldName?: string;
    isDateField?: boolean;
    isYearField?: boolean;
    isNumberField?: boolean;
    isCurrencyField?: boolean;
  }) => {
    // Generate a unique ID for this input field
    const id = `${section || 'input'}-${fieldName || Math.random().toString(36).substring(2)}`;
    
    const updateValue = () => {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input && input.value !== value) {
        const event = {
          target: input
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
        
        // Validate the field on blur
        if (section && fieldName) {
          validateField(section, fieldName);
        }
      }
    };
    
    // Initialize input value using useEffect
    React.useEffect(() => {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input && input.value !== value) {
        input.value = value;
      }
    }, [id, value]);
    
    return (
      <div className="flex-1">
        <label htmlFor={id} className="block text-base font-semibold text-[#333333] mb-1">
          {label}
          {showInfoIcon && (
            <span className="inline-block ml-2 text-[#007B87]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="#007B87"/>
              </svg>
            </span>
          )}
        </label>
        {isDateField ? (
          // Use a completely different input approach for date fields
          <div className="date-input-wrapper">
            <input
              id={id}
              type="text" 
              defaultValue={value}
              onBlur={updateValue}
              placeholder={placeholder || "MM/DD/YYYY"}
              className={`w-full p-2 border rounded ${error ? 'border-[#C60C30] bg-[#FFF8F8]' : 'border-[#D8D8D8]'}`}
              autoComplete="off"
              maxLength={10}
              pattern="\d{2}/\d{2}/\d{4}"
              // Use separate input fields for month, day, year with auto-tab
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                let value = target.value;
                
                // Auto-format with slashes
                if (value.length === 2 && !value.includes('/')) {
                  target.value = value + '/';
                } else if (value.length === 5 && value.indexOf('/', 3) === -1) {
                  target.value = value + '/';
                }
              }}
            />
          </div>
        ) : isYearField ? (
          // Special handling for year fields
          <input
            id={id}
            type="text"
            defaultValue={value}
            onBlur={updateValue}
            onKeyDown={(e) => {
              // Handle Enter key separately to update on Enter as well
              if (e.key === 'Enter') {
                updateValue();
              }
            }}
            placeholder={placeholder || "YYYY"}
            className={`w-full p-2 border rounded ${error ? 'border-[#C60C30] bg-[#FFF8F8]' : 'border-[#D8D8D8]'}`}
            autoComplete="off"
            maxLength={4}
            pattern="\d{4}"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              // Restrict to digits only
              target.value = target.value.replace(/[^\d]/g, '').slice(0, 4);
            }}
          />
        ) : isNumberField ? (
          // Special handling for number fields (such as incurred claims)
          <input
            id={id}
            type="text"
            defaultValue={value}
            onBlur={updateValue}
            onKeyDown={(e) => {
              // Handle Enter key separately to update on Enter as well
              if (e.key === 'Enter') {
                updateValue();
              }
            }}
            placeholder={placeholder}
            className={`w-full p-2 border rounded ${error ? 'border-[#C60C30] bg-[#FFF8F8]' : 'border-[#D8D8D8]'}`}
            autoComplete="off"
            pattern="\d*"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              // Restrict to digits only
              target.value = target.value.replace(/[^\d]/g, '');
            }}
          />
        ) : isCurrencyField ? (
          // Special handling for currency fields (such as total losses paid)
          <input
            id={id}
            type="text"
            defaultValue={value}
            onBlur={updateValue}
            onKeyDown={(e) => {
              // Handle Enter key separately to update on Enter as well
              if (e.key === 'Enter') {
                updateValue();
              }
            }}
            placeholder={placeholder || "$0.00"}
            className={`w-full p-2 border rounded ${error ? 'border-[#C60C30] bg-[#FFF8F8]' : 'border-[#D8D8D8]'}`}
            autoComplete="off"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              // Allow only digits, commas, periods, and dollar sign
              let value = target.value.replace(/[^\d$,\.]/g, '');
              
              // Ensure only one dollar sign at the beginning
              if (value.indexOf('$') > 0) {
                value = value.replace(/\$/g, '');
                if (value.length > 0) {
                  value = '$' + value;
                }
              } else if (value.split('$').length > 2) {
                value = '$' + value.replace(/\$/g, '');
              }
              
              // Ensure proper decimal format (only one decimal point)
              const parts = value.replace(/\$/g, '').split('.');
              if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
              }
              
              // Limit to 2 decimal places
              if (parts.length > 1 && parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].substring(0, 2);
              }
              
              target.value = value;
            }}
          />
        ) : (
          // Use regular input for other fields
          <input
            id={id}
            type="text"
            defaultValue={value}
            onBlur={updateValue}
            onKeyDown={(e) => {
              // Handle Enter key separately to update on Enter as well
              if (e.key === 'Enter') {
                updateValue();
              }
            }}
            placeholder={placeholder}
            className={`w-full p-2 border rounded ${error ? 'border-[#C60C30] bg-[#FFF8F8]' : 'border-[#D8D8D8]'}`}
            autoComplete="off"
          />
        )}
        {error && (
          <p className="text-[#C60C30] text-sm mt-1">{error}</p>
        )}
        {isDateField && !error && (
          <p className="text-gray-500 text-xs mt-1">Format: MM/DD/YYYY</p>
        )}
        {isYearField && !error && (
          <p className="text-gray-500 text-xs mt-1">Format: YYYY</p>
        )}
      </div>
    );
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
          <div className="w-full mb-6 ">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
            >
              <h2 className="text-2xl font-semibold text-[#333333] leading-[1.333em]">Loss History</h2>
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
                  <div className="p-[0px_40px] mb-6">
                    <RadioGroup
                      name="occupationalAccident_inPlace"
                      value={occupationalAccidentInPlace}
                      onChange={setOccupationalAccidentInPlace}
                      label="Is Occupational Accident coverage currently in place?"
                      error={validationErrors.occupationalAccident.errors.inPlace}
                      section="occupationalAccident"
                    />
                  </div>
                  
                  {occupationalAccidentInPlace === 'yes' && (
                    <div className="p-[0px_32px] mb-6">
                      <div className="flex flex-row gap-4 mb-4">
                        <InputField 
                          label="Loss run evaluation date"
                          value={dates.occupationalAccident.lossRunEvaluation}
                          onChange={(e) => handleOccupationalAccidentDateChange('lossRunEvaluation', e.target.value)}
                          placeholder="MM/DD/YYYY"
                          showInfoIcon
                          error={validationErrors.occupationalAccident.errors.lossRunEvaluation}
                          section="occupationalAccident"
                          fieldName="lossRunEvaluation"
                          isDateField={true}
                        />
                        
                        <InputField 
                          label="Anniversary date"
                          value={dates.occupationalAccident.anniversary}
                          onChange={(e) => handleOccupationalAccidentDateChange('anniversary', e.target.value)}
                          placeholder="MM/DD/YYYY"
                          showInfoIcon
                          error={validationErrors.occupationalAccident.errors.anniversary}
                          section="occupationalAccident"
                          fieldName="anniversary"
                          isDateField={true}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-base font-semibold text-[#333333] mb-4">
                          Average number of covered lives
                        </p>
                        
                        <div className="flex flex-row gap-4 mb-4">
                          <InputField 
                            label="Current policy year"
                            value={coveredData.occupationalAccident.current}
                            onChange={(e) => handleOccupationalAccidentCoveredDataChange('current', e.target.value)}
                            placeholder="YYYY"
                            error={validationErrors.occupationalAccident.errors.current}
                            section="occupationalAccident"
                            fieldName="current"
                            isYearField={true}
                          />
                          
                          <InputField 
                            label="Prior policy year"
                            value={coveredData.occupationalAccident.prior}
                            onChange={(e) => handleOccupationalAccidentCoveredDataChange('prior', e.target.value)}
                            placeholder="YYYY"
                            error={validationErrors.occupationalAccident.errors.prior}
                            section="occupationalAccident"
                            fieldName="prior"
                            isYearField={true}
                          />
                          
                          <InputField 
                            label="3rd policy year"
                            value={coveredData.occupationalAccident.third}
                            onChange={(e) => handleOccupationalAccidentCoveredDataChange('third', e.target.value)}
                            placeholder="YYYY"
                            error={validationErrors.occupationalAccident.errors.third}
                            section="occupationalAccident"
                            fieldName="third"
                            isYearField={true}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <RadioGroup
                          name="occupationalAccident_claims"
                          value={occupationalAccidentClaims}
                          onChange={setOccupationalAccidentClaims}
                          label="Have there been any claims?"
                          error={validationErrors.occupationalAccident.errors.claims}
                          section="occupationalAccident"
                        />
                        
                        {occupationalAccidentClaims === 'yes' && (
                          <div className="flex flex-row gap-4">
                            <InputField 
                              label="Number of Incurred Claims?"
                              value={claimsData.occupationalAccident.incurred}
                              onChange={(e) => handleOccupationalAccidentClaimsDataChange('incurred', e.target.value)}
                              error={validationErrors.occupationalAccident.errors.incurred}
                              section="occupationalAccident"
                              fieldName="incurred"
                              placeholder="Enter a number"
                              isNumberField={true}
                            />
                            
                            <InputField 
                              label="What are the total losses paid?"
                              value={claimsData.occupationalAccident.totalLosses}
                              onChange={(e) => handleOccupationalAccidentClaimsDataChange('totalLosses', e.target.value)}
                              error={validationErrors.occupationalAccident.errors.totalLosses}
                              section="occupationalAccident"
                              fieldName="totalLosses"
                              placeholder="$0.00"
                              isCurrencyField={true}
                            />
                          </div>
                        )}
                      </div>
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
                  <div className="p-[0px_40px] mb-6">
                    <RadioGroup
                      name="nonTruckingLiability_inPlace"
                      value={nonTruckingLiabilityInPlace}
                      onChange={setNonTruckingLiabilityInPlace}
                      label="Is Non-Trucking Liability coverage currently in place?"
                      error={validationErrors.nonTruckingLiability.errors.inPlace}
                      section="nonTruckingLiability"
                    />
                  </div>
                  
                  {nonTruckingLiabilityInPlace === 'yes' && (
                    <div className="p-[0px_32px] mb-6">
                      <div className="flex flex-row gap-4 mb-4">
                        <InputField 
                          label="Loss run evaluation date"
                          value={dates.nonTruckingLiability.lossRunEvaluation}
                          onChange={(e) => handleNonTruckingLiabilityDateChange('lossRunEvaluation', e.target.value)}
                          placeholder="MM/DD/YYYY"
                          showInfoIcon
                          error={validationErrors.nonTruckingLiability.errors.lossRunEvaluation}
                          section="nonTruckingLiability"
                          fieldName="lossRunEvaluation"
                          isDateField={true}
                        />
                        
                        <InputField 
                          label="Anniversary date"
                          value={dates.nonTruckingLiability.anniversary}
                          onChange={(e) => handleNonTruckingLiabilityDateChange('anniversary', e.target.value)}
                          placeholder="MM/DD/YYYY"
                          showInfoIcon
                          error={validationErrors.nonTruckingLiability.errors.anniversary}
                          section="nonTruckingLiability"
                          fieldName="anniversary"
                          isDateField={true}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-base font-semibold text-[#333333] mb-4">
                          Average number of covered units
                        </p>
                        
                        <div className="flex flex-row gap-4 mb-4">
                          <InputField 
                            label="Current policy year"
                            value={coveredData.nonTruckingLiability.current}
                            onChange={(e) => handleNonTruckingLiabilityCoveredDataChange('current', e.target.value)}
                            placeholder="YYYY"
                            isYearField={true}
                          />
                          
                          <InputField 
                            label="Prior policy year"
                            value={coveredData.nonTruckingLiability.prior}
                            onChange={(e) => handleNonTruckingLiabilityCoveredDataChange('prior', e.target.value)}
                            placeholder="YYYY"
                            isYearField={true}
                          />
                          
                          <InputField 
                            label="3rd policy year"
                            value={coveredData.nonTruckingLiability.third}
                            onChange={(e) => handleNonTruckingLiabilityCoveredDataChange('third', e.target.value)}
                            placeholder="YYYY"
                            isYearField={true}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <RadioGroup
                          name="nonTruckingLiability_claims"
                          value={nonTruckingLiabilityClaims}
                          onChange={setNonTruckingLiabilityClaims}
                          label="Have there been any claims?"
                          section="nonTruckingLiability"
                        />
                        
                        {nonTruckingLiabilityClaims === 'yes' && (
                          <div className="flex flex-row gap-4">
                            <InputField 
                              label="Number of Incurred Claims?"
                              value={claimsData.nonTruckingLiability.incurred}
                              onChange={(e) => handleNonTruckingLiabilityClaimsDataChange('incurred', e.target.value)}
                              placeholder="Enter a number"
                              isNumberField={true}
                            />
                            
                            <InputField 
                              label="What are the total losses paid?"
                              value={claimsData.nonTruckingLiability.totalLosses}
                              onChange={(e) => handleNonTruckingLiabilityClaimsDataChange('totalLosses', e.target.value)}
                              placeholder="$0.00"
                              isCurrencyField={true}
                            />
                          </div>
                        )}
                      </div>
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
                  <div className="p-[0px_40px] mb-6">
                    <RadioGroup
                      name="vehiclePhysicalDamage_inPlace"
                      value={vehiclePhysicalDamageInPlace}
                      onChange={setVehiclePhysicalDamageInPlace}
                      label="Is current Vehicle Physical Damage coverage in place?"
                      error={validationErrors.vehiclePhysicalDamage.errors.inPlace}
                      section="vehiclePhysicalDamage"
                    />
                  </div>
                  
                  {vehiclePhysicalDamageInPlace === 'yes' && (
                    <div className="p-[0px_32px] mb-6">
                      <div className="flex flex-row gap-4 mb-4">
                        <InputField 
                          label="Inception date"
                          value={dates.vehiclePhysicalDamage.inception}
                          onChange={(e) => handleVehiclePhysicalDamageDateChange('inception', e.target.value)}
                          placeholder="MM/DD/YYYY"
                          showInfoIcon
                          error={validationErrors.vehiclePhysicalDamage.errors.inception}
                          section="vehiclePhysicalDamage"
                          fieldName="inception"
                          isDateField={true}
                        />
                        
                        <InputField 
                          label="Loss run evaluation date"
                          value={dates.vehiclePhysicalDamage.lossRunEvaluation}
                          onChange={(e) => handleVehiclePhysicalDamageDateChange('lossRunEvaluation', e.target.value)}
                          placeholder="MM/DD/YYYY"
                          showInfoIcon
                          error={validationErrors.vehiclePhysicalDamage.errors.lossRunEvaluation}
                          section="vehiclePhysicalDamage"
                          fieldName="lossRunEvaluation"
                          isDateField={true}
                        />
                      </div>
                      
                      <div className="flex flex-row gap-4 mb-6">
                        <InputField 
                          label="Anniversary date"
                          value={dates.vehiclePhysicalDamage.anniversary}
                          onChange={(e) => handleVehiclePhysicalDamageDateChange('anniversary', e.target.value)}
                          placeholder="MM/DD/YYYY"
                          showInfoIcon
                          error={validationErrors.vehiclePhysicalDamage.errors.anniversary}
                          section="vehiclePhysicalDamage"
                          fieldName="anniversary"
                          isDateField={true}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-base font-semibold text-[#333333] mb-4">
                          Average TIV per policy year
                        </p>
                        
                        <div className="flex flex-row gap-4 mb-4">
                          <InputField 
                            label="Current policy year"
                            value={coveredData.vehiclePhysicalDamage.current}
                            onChange={(e) => handleVehiclePhysicalDamageCoveredDataChange('current', e.target.value)}
                            placeholder="YYYY"
                            isYearField={true}
                          />
                          
                          <InputField 
                            label="Prior policy year"
                            value={coveredData.vehiclePhysicalDamage.prior}
                            onChange={(e) => handleVehiclePhysicalDamageCoveredDataChange('prior', e.target.value)}
                            placeholder="YYYY"
                            isYearField={true}
                          />
                          
                          <InputField 
                            label="3rd policy year"
                            value={coveredData.vehiclePhysicalDamage.third}
                            onChange={(e) => handleVehiclePhysicalDamageCoveredDataChange('third', e.target.value)}
                            placeholder="YYYY"
                            isYearField={true}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <RadioGroup
                          name="vehiclePhysicalDamage_claims"
                          value={vehiclePhysicalDamageClaims}
                          onChange={setVehiclePhysicalDamageClaims}
                          label="Have there been any claims?"
                          section="vehiclePhysicalDamage"
                        />
                        
                        {vehiclePhysicalDamageClaims === 'yes' && (
                          <div className="flex flex-row gap-4">
                            <InputField 
                              label="Number of Incurred Claims?"
                              value={claimsData.vehiclePhysicalDamage.incurred}
                              onChange={(e) => handleVehiclePhysicalDamageClaimsDataChange('incurred', e.target.value)}
                              placeholder="Enter a number"
                              isNumberField={true}
                            />
                            
                            <InputField 
                              label="What are the total losses paid?"
                              value={claimsData.vehiclePhysicalDamage.totalLosses}
                              onChange={(e) => handleVehiclePhysicalDamageClaimsDataChange('totalLosses', e.target.value)}
                              placeholder="$0.00"
                              isCurrencyField={true}
                            />
                          </div>
                        )}
                      </div>
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
