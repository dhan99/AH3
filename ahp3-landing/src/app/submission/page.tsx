'use client';

import React, { useState, useMemo } from 'react';
import useSubmissionStore from '@/store/useSubmissionStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import {
  Breadcrumb,
  ProgressStepper,
  ProductDetailCard,
  AddressEditModal,
  MotorCarrierContact,
  ContactInfo as MCContactInfo
} from '@/components/submission';
import Button from '@/components/ui/Button';

// Declare the window property for validateContactInfo function
declare global {
  interface Window {
    validateContactInfo?: () => boolean;
  }
}

export default function SubmissionPage() {
  const router = useRouter();
  const { isLoading, logout, user: authUser } = useMockAuth();
  
  // State that doesn't need to be persisted (UI state only)
  const [contactValidationTriggered, setContactValidationTriggered] = useState(false);
  const [isMCContactValid, setIsMCContactValid] = useState(false);
  const [dotError, setDotError] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [mcContactError, setMcContactError] = useState('');
  const [productSelectionValid, setProductSelectionValid] = useState(true);
  const [productValidationError, setProductValidationError] = useState('');
  
  // Access the store
  const submissionStore = useSubmissionStore();
  const {
    dotNumber,
    isDOTValid, 
    carrierInfo,
    addressData,
    contactData,
    isContactValid,
    openSections,
    selectedProducts,
    setDotNumber,
    setIsDOTValid,
    setCarrierInfo,
    setContactData,
    setIsContactValid,
    setAddressData,
    setOpenSection,
    setSelectedProducts
  } = submissionStore;
  
  // Function to toggle accordion sections
  const toggleSection = (section: 'motorCarrier' | 'motorCarrierContact' | 'coverage') => {
    setOpenSection(section, !openSections[section]);
  };
  
  // Products data from Figma design
  const products = [
    {
      id: 'occupational_accident',
      title: 'Occupational Accident',
      description: 'Essential coverage for independent contractors who are not eligible for workers\' compensation. Protects drivers by covering medical expenses, disability benefits, and accidental death in the event of a work related injury.',
      iconSrc: '/images/medical-icon.svg',
      costHighlight: '$100-$500 per driver/month',
      benefits: [
        { label: 'Aggregate Limit of Liability', value: '$2,000,000' },
        { label: 'Temporary Total Disability Benefit', value: '$125-700/week 10-104 weeks' },
        { label: 'Accidental Death Benefit', value: '$50,000 / 365 days' },
        { label: 'Acc Med Expense Benefit', value: '$500,000' },
        { label: 'Survivors Benefit', value: 'up to $200,000 / up to $2,000 month' },
        { label: 'Continuous Total Disability', value: '$50-$700/week' },
        { label: 'Acc Dismemberment Benefit', value: 'up to $250,000 / 365 days' },
        { label: 'Accidental Medical Expense', value: '$1,000,000' }
      ]
    },
    {
      id: 'non_trucking_liability',
      title: 'Non-Trucking Liability',
      description: 'Covers drivers for drivers when they are using the truck for non-business purposes, such as personal errands or commuting. This protection fills the gap when a driver is off dispatch, shielding them from potential liability claims that could otherwise be costly.',
      iconSrc: '/images/hail-icon.svg',
      costHighlight: '$75 per driver/month',
      benefits: [
        { label: 'Limit', value: '$1,000,000' },
        { label: 'Cost per unit', value: '$300' }
      ]
    },
    {
      id: 'vehicle_physical_damage',
      title: 'Vehicle Physical Damage',
      description: 'Pays for repairs or replacement of the truck in case of damage from accident, fire, theft, or natural disasters. This coverage helps protect a motor carrier\'s investment in equipment, ensuring the vehicle stays on the road with minimal financial setbacks.',
      iconSrc: '/images/vehicle-damage-icon.svg',
      costHighlight: '3-5% of vehicle value/year',
      benefits: [
        { label: 'Any one covered truck/covered trailer', value: '$250,000' },
        { label: 'Any one Policy', value: '$5,000,000' },
        { label: 'Limit', value: '$1,000,000' },
        { label: 'Cost per unit', value: '$300' },
      ],
      additionalDetails: (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-[#333333] mb-2">Vehicle Physical Damage</h4>
            <p className="text-sm text-[#333333]">Actual Cash Value, not to exceed Stated Value</p>
            <p className="text-sm text-[#757575]">$1,000 Deductible</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-[#333333] mb-2">Finance Agreement Gap</h4>
            <p className="text-sm text-[#333333]">Greater of actual cash value or the outstanding financial obligation, not to exceed stated amount on applicable Certificate of Insurance.</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-[#333333] mb-2">Truck Rental</h4>
            <p className="text-sm text-[#333333]">Up to $100 per day for up to 14 days</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-[#333333] mb-2">Personal Contents</h4>
            <p className="text-sm text-[#333333]">Replacement cost or actual cash value to maximum of $5,000</p>
            <p className="text-sm text-[#757575]">$250 Deductible</p>
          </div>
        </div>
      )
    }
  ];

  // Define steps for progress sidebar
  const steps = [
    {
      stepNumber: 1,
      title: 'Start New Submission',
      isActive: true,
      isCompleted: false,
      subsections: [
        { title: 'Select Coverage', isActive: true }
      ]
    },
    {
      stepNumber: 2,
      title: 'Eligibility',
      isActive: false,
      isCompleted: false
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

  // Breadcrumb items exactly matching Figma design
  const breadcrumbItems = [
    { label: 'home', href: '/dashboard', isIcon: true },
    { label: 'New Submission', href: '#' },
    { label: 'Questionnaire', active: true }
  ];

  // Product selection handler
  const handleProductSelect = (productId: string) => {
    const prevProducts = selectedProducts;
    let newSelection;
    
    if (prevProducts.includes(productId)) {
      newSelection = prevProducts.filter(id => id !== productId);
    } else {
      newSelection = [...prevProducts, productId];
    }
    
    // Validate the new selection
    const isValid = newSelection.length > 0;
    setProductSelectionValid(isValid);
    
    if (!isValid) {
      setProductValidationError('Please select at least one coverage product');
    } else {
      setProductValidationError('');
    }
    
    // Update the store
    setSelectedProducts(newSelection);
  };

  // Handle DOT search input change
  const handleDotInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force uppercase for the USDOT prefix
    let value = e.target.value;
    if (value.length <= 5) {
      value = value.toUpperCase();
    }
    setDotNumber(value);
  };

  // Handle DOT search
  const handleDotSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDotError('');
    setIsDOTValid(false); // Reset DOT validation when searching
    
    // Validate DOT number
    if (!dotNumber.trim()) {
      setDotError('Please enter a DOT number to search');
      return;
    }

    // Validate format: "USDOT" followed by 8 digits
    const dotRegex = /^USDOT\d{8}$/;
    if (!dotRegex.test(dotNumber)) {
      setDotError('DOT number must be in format "USDOT" followed by 8 digits (e.g., USDOT12345678)');
      return;
    }
    
    // Hide the carrier info without affecting the rest of the UI
    setShowAnimation(false);
    
    // Longer delay to ensure a clear transition
    setTimeout(() => {
      // Mock data for demonstration - use the entered DOT number as MC Number
      setCarrierInfo({
        mcNumber: dotNumber, // Use the entered DOT number as MC Number
        name: 'Very Good Trucking',
        dbaName: 'Some Trucking Co. Doing Business As Name',
        address: '450 Rusty Rd',
        city: 'Atownin',
        state: 'AL',
        zipCode: '01234',
        vehicles: 12,
        warnings: ['Reports of consumer complaints'],
        errors: ['Out of service', 'Not allowed to operate', 'Has recent violations'],
        info: ['Operating 12 total vehicles']
      });

      // Set up address data for modal
      setAddressData({
        streetAddress: '450 Rusty Rd',
        city: 'Atownin',
        state: 'AL',
        zipCode: '01234',
        country: 'USA'
      });
      
      // Mark DOT as valid since we successfully retrieved data
      setIsDOTValid(true);
      
      // Show the animation after updating the data
      setShowAnimation(true);
    }, 300); // Increased delay for more dramatic transition effect
  };

  // Handle edit address modal
  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddressData({
      ...addressData,
      [name]: value
    });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only proceed if we have carrier info
    if (!carrierInfo) return;
    
    // Store current carrier info temporarily to maintain other data
    const tempCarrierInfo = {...carrierInfo};
    
    // Hide the animation without affecting the rest of the UI
    setShowAnimation(false);
    
    // Close the modal immediately
    closeAddressModal();
    
    // Longer delay to ensure a clear transition
    setTimeout(() => {
      // Update carrier info with new address while keeping everything else
      setCarrierInfo({
        mcNumber: tempCarrierInfo.mcNumber,
        name: tempCarrierInfo.name,
        dbaName: tempCarrierInfo.dbaName,
        vehicles: tempCarrierInfo.vehicles,
        warnings: tempCarrierInfo.warnings,
        errors: tempCarrierInfo.errors,
        info: tempCarrierInfo.info,
        // Update address fields
        address: addressData.streetAddress,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode
      });
      
      // DOT remains valid after address update
      // No need to change isDOTValid as it should remain true
      
      // Show the animation after updating the data
      setShowAnimation(true);
    }, 400); // Increased delay for more dramatic transition effect
  };

  // Handle validation for Motor Carrier Contact
  const handleContactValidationChange = (isValid: boolean) => {
    setIsContactValid(isValid);
  };
  
  // Create a helper to convert store ContactInfo to MCContactInfo
  const convertStoreContactInfoToMC = () => {
    if (!contactData) return undefined;
    
    // Create a state object to return to the component
    // We need to preserve both the contact info and address info
    const mcContactInfo: MCContactInfo = {
      firstName: contactData.firstName || '',
      lastName: contactData.lastName || '',
      title: '',
      email: contactData.email || '',
      phone: contactData.phone || '',
      // Determine whether to check "Same as address above" based on whether
      // the stored address matches the DOT address
      useAddressAbove: !!(carrierInfo && 
        addressData.streetAddress === carrierInfo.address &&
        addressData.city === carrierInfo.city &&
        addressData.state === carrierInfo.state &&
        addressData.zipCode === carrierInfo.zipCode),
      // Use the address data from the store instead of empty strings
      streetAddress: addressData.streetAddress || '',
      city: addressData.city || '',
      state: addressData.state || '',
      zipCode: addressData.zipCode || ''
    };
    
    return mcContactInfo;
  };
  
  // Handler function for when contact data changes
  const handleContactDataChange = (data: MCContactInfo) => {
    // Store the contact info basics
    setContactData({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: 'Contact' // Default role since MCContactInfo doesn't have this property
    });
    
    // If useAddressAbove is checked, copy the carrier address to the contact's address
    if (data.useAddressAbove && carrierInfo) {
      // The component will handle updating its internal state
      // Also update the address data in the Zustand store
      setAddressData({
        streetAddress: carrierInfo.address,
        city: carrierInfo.city,
        state: carrierInfo.state,
        zipCode: carrierInfo.zipCode,
        country: 'USA'
      });
    } else if (!data.useAddressAbove) {
      // If not using address above, store the address data from the form inputs
      setAddressData({
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: 'USA'
      });
    }
  };
  
  // Handler function for Motor Carrier Contact validation
  const handleMCContactValidationChange = (isValid: boolean) => {
    setIsMCContactValid(isValid);
  };

  const handleNextStepWithSectionsClose = () => {
    // First, close all sections to refresh their state
    const sections = ['motorCarrier', 'motorCarrierContact', 'coverage'];
    sections.forEach(section => {
      setOpenSection(section as 'motorCarrier' | 'motorCarrierContact' | 'coverage', false);
    });
    
    // Then reopen them after a short delay for a smooth animation
    setTimeout(() => {
      sections.forEach(section => {
        setOpenSection(section as 'motorCarrier' | 'motorCarrierContact' | 'coverage', true);
      });
    }, 300);
    
    // Ensure validation happens after sections have reopened with a longer delay
    setTimeout(() => {
      handleNextStep();
    }, 500);
  };
  
  // Separate function for validation logic (moved from handleNextStep)
  const handleNextStep = () => {
    // Set validation triggered flag to show any validation errors
    setContactValidationTriggered(true);
    
    // First validate if DOT is valid
    if (!isDOTValid) {
      setDotError('Please search for and select a valid DOT number');
      // Scroll to the Motor Carrier section if DOT validation fails
      document.getElementById('motorCarrierSection')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Then validate Motor Carrier Contact
    let contactValid = true;
    
    // Access the validateContactInfo function from the window object
    if (window.validateContactInfo) {
      contactValid = window.validateContactInfo();
    }
    
    // If contact validation fails, set error message and scroll to that section
    if (!contactValid) {
      setIsMCContactValid(false);
      setMcContactError('Please complete all required fields in the Motor Carrier Contact section');
      
      // Open the section if it's closed
      if (!openSections.motorCarrierContact) {
        setOpenSection('motorCarrierContact', true);
      }
      
      document.getElementById('motorCarrierContactSection')?.scrollIntoView({ behavior: 'smooth' });
      return;
    } else {
      // Clear error if previously set
      setMcContactError('');
    }
    
    // Validate that at least one product is selected
    if (!productSelectionValid) {
      setProductValidationError('Please select at least one coverage product');
      // Open the coverage section if it's closed
      if (!openSections.coverage) {
        setOpenSection('coverage', true);
      }
      // Scroll to the coverage section
      document.getElementById('coverageSection')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // At this point, all validations have passed
    setIsMCContactValid(true);
    
    // If all validations pass, proceed to next step
    router.push('/submission/eligibility');
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
        <div className="min-w-[260px] shadow-sm-0 bg-white">
          <ProgressStepper steps={steps} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8 bg-[#F9F8FB]">
          <h1 className="text-3xl font-bold text-[#333333] mb-6">New Submission</h1>
          
          {/* Motor Carrier (Insured) Section */}
          <div id="motorCarrierSection" className="bg-white rounded mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('motorCarrier')}
            >
              <h2 className="text-2xl font-semibold text-[#333333] leading-[1.333em]">Motor Carrier (Insured)</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.motorCarrier ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.motorCarrier && (
              <div className="p-6">
                <form onSubmit={handleDotSearch} className="mb-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-end gap-4">
                      <div className="flex-grow">
                        <label htmlFor="dotNumber" className="block text-base font-semibold text-[#333333] mb-1">
                          Motor Carrier DOT
                        </label>
                        <input
                          type="text"
                          id="dotNumber"
                          value={dotNumber}
                          onChange={handleDotInputChange}
                          className={`w-full px-4 py-3 border ${dotError ? 'border-[#C60C30]' : 'border-[#D8D8D8]'} rounded-md`}
                          placeholder="Format: USDOT12345678"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#007B87] text-white font-semibold rounded"
                      >
                        Search
                      </button>
                    </div>
                    {/* Error message in its own container to avoid layout shifts */}
                    {dotError && (
                      <p className="text-[#C60C30] text-sm">{dotError}</p>
                    )}
                  </div>
                </form>

                <div className="mt-6">
                  <div className="flex space-x-8">
                    <div className="flex-1">
                      {/* Address Information with more dramatic animation */}
                      <AnimatePresence>
                        {carrierInfo && showAnimation && (
                          <motion.div 
                            className="mb-6 whitespace-pre-line"
                            key="address-info"
                            initial={{ opacity: 0, y: 180 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -100 }}
                            transition={{ 
                              duration: 1.2, 
                              ease: [0.16, 1, 0.3, 1],
                              opacity: { duration: 0.5 }
                            }}
                          >
                            <p className="text-base text-[#333333]">
                              MC Number: {carrierInfo.mcNumber}
                            </p>
                            <p className="text-base font-semibold text-[#333333] mt-2">
                              {carrierInfo.name}
                            </p>
                            <p className="text-base text-[#333333]">
                              DBA: {carrierInfo.dbaName}
                            </p>
                            <p className="text-base text-[#333333] mt-2">
                              {carrierInfo.address}
                              <br />
                              {carrierInfo.city}, {carrierInfo.state} {carrierInfo.zipCode}
                              <br />
                              <button
                                type="button"
                                onClick={openAddressModal}
                                className="text-[#007B87] hover:underline mt-1"
                              >
                                Update address
                              </button>
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Notifications stay visible without separate animations */}
                      {carrierInfo && showAnimation && carrierInfo.errors.length > 0 && (
                        <div className="bg-[#FFE6EC] border border-[#C60C30] rounded-md p-4 flex">
                          <div className="w-6 h-6 rounded-full bg-[#C60C30] text-white flex-shrink-0 flex items-center justify-center mr-4">
                            <span className="text-sm font-bold">!</span>
                          </div>
                          <div>
                            {carrierInfo.errors.map((error, index) => (
                              <p key={index} className="text-sm text-[#333333]">{error}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {carrierInfo && showAnimation && carrierInfo.warnings.length > 0 && (
                        <div className="bg-[#FFE9D9] border border-[#FF852C] rounded-md p-4 flex">
                          <div className="w-6 h-6 rounded-full bg-[#E05E00] text-white flex-shrink-0 flex items-center justify-center mr-4">
                            <span className="text-sm font-bold">!</span>
                          </div>
                          <div>
                            {carrierInfo.warnings.map((warning, index) => (
                              <p key={index} className="text-sm text-[#333333]">{warning}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {carrierInfo && showAnimation && carrierInfo.info.length > 0 && (
                        <div className="bg-[#D9F4F5] border border-[#007B87] rounded-md p-4 flex">
                          <div className="w-6 h-6 rounded-full bg-[#00626B] text-white flex-shrink-0 flex items-center justify-center mr-4">
                            <span className="text-sm font-bold">i</span>
                          </div>
                          <div>
                            {carrierInfo.info.map((info, index) => (
                              <p key={index} className="text-sm text-[#333333]">{info}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Motor Carrier Contact Section - Using updated styling */}
          <div id="motorCarrierContactSection" className="bg-white rounded mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('motorCarrierContact')}
            >
              <h2 className="text-2xl font-semibold text-[#333333] leading-[1.333em]">Motor Carrier Contact</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.motorCarrierContact ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.motorCarrierContact && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Motor Carrier Contact validation error message */}
                {mcContactError && (
                  <div className="bg-[#FFE6EC] border border-[#C60C30] rounded-md p-4 m-6 mb-0 flex">
                    <div className="w-6 h-6 rounded-full bg-[#C60C30] text-white flex-shrink-0 flex items-center justify-center mr-4">
                      <span className="text-sm font-bold">!</span>
                    </div>
                    <p className="text-sm text-[#333333]">{mcContactError}</p>
                  </div>
                )}
                
                <MotorCarrierContact 
                  dotAddressData={carrierInfo ? {
                    streetAddress: carrierInfo.address,
                    city: carrierInfo.city,
                    state: carrierInfo.state,
                    zipCode: carrierInfo.zipCode
                  } : null}
                  onValidationChange={handleMCContactValidationChange}
                  onDataChange={handleContactDataChange}
                  initialData={convertStoreContactInfoToMC()}
                  onCheckboxChange={() => {
                    // Create a smooth animation by closing and reopening the section
                    setOpenSection('motorCarrierContact', false);
                    setTimeout(() => {
                      setOpenSection('motorCarrierContact', true);
                    }, 300); // Short delay for a smooth animation
                  }}
                />
              </motion.div>
            )}
          </div>
          
          {/* Coverage Section - Updated with Figma styling */}
          <div id="coverageSection" className="bg-white rounded mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('coverage')}
            >
              <h2 className="text-2xl font-semibold text-[#333333] leading-[1.333em]">Coverage</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${openSections.coverage ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.coverage && (
              <div className="p-8">
                {/* Validation error message */}
                {productValidationError && (
                  <div className="bg-[#FFE6EC] border border-[#C60C30] rounded-md p-4 mb-6 flex">
                    <div className="w-6 h-6 rounded-full bg-[#C60C30] text-white flex-shrink-0 flex items-center justify-center mr-4">
                      <span className="text-sm font-bold">!</span>
                    </div>
                    <p className="text-sm text-[#333333]">{productValidationError}</p>
                  </div>
                )}
                
                {/* Products */}
                <div className="space-y-8">
                  {products.map(product => (
                    <div key={product.id} className="bg-white rounded-md overflow-hidden mb-8 shadow-sm-0">
                      <div className="flex">
                        <div className="w-full md:w-[40%] p-6 bg-white">
                          <ProductDetailCard
                            title={product.title}
                            description={product.description}
                            iconSrc={product.iconSrc}
                            isSelected={selectedProducts.includes(product.id)}
                            onSelect={() => handleProductSelect(product.id)}
                            coverageSections={[]}
                            showCoverageDetails={false}
                            className="border-0 shadow-none mb-0"
                            costHighlight={product.costHighlight}
                          />
                        </div>
                        
                        <div className="w-full md:w-[60%]">
                          <div className="p-4 bg-white">
                            <h3 className="font-semibold text-lg text-[#333333]">Included Benefits and Coverage</h3>
                          </div>
                          
                          <div className="p-4 md:grid md:grid-cols-2 gap-4">
                            {product.benefits.map((benefit, index) => (
                              <div key={index} className="mb-2">
                                <p className="text-sm text-[#666666]">{benefit.label}</p>
                                <p className="font-semibold text-[#333333]">{benefit.value}</p>
                              </div>
                            ))}
                          </div>
                          
                          {product.id === 'vehicle_physical_damage' && selectedProducts.includes(product.id) && (
                            <div className="p-4 md:grid md:grid-cols-1 gap-4 border-t border-[#D8D8D8]">
                              {product.additionalDetails}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Button Bar - Full width spanning both sidebar and main content */}
      <div className="w-full flex justify-end py-6 bg-[#E6EEEF]">
        <Button
          type="button"
          onClick={handleNextStep}
          iconRight={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.51922 5C9.82089 5 10.1213 5.12211 10.3407 5.36256L15.71 11.2514C16.0967 11.6756 16.0967 12.3244 15.71 12.7486L10.3407 18.6374C9.92722 19.0909 9.22433 19.1234 8.771 18.71C8.31756 18.2964 8.28511 17.5938 8.69845 17.1403L13.3853 12L8.69845 6.85967C8.28511 6.40622 8.31756 5.70356 8.771 5.29C8.984 5.09578 9.25211 5 9.51922 5Z" fill="white"/>
            </svg>
          }
          className="bg-[#007B87] text-white font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#005F69] mr-6"
        >
          Eligibility
        </Button>
      </div>
      
      {/* Address Edit Modal */}
      {isAddressModalOpen && (
        <AddressEditModal
          isOpen={isAddressModalOpen}
          onClose={closeAddressModal}
          addressData={addressData}
          onChange={handleAddressChange}
          onSubmit={handleAddressSubmit}
        />
      )}
    </div>
  );
}
