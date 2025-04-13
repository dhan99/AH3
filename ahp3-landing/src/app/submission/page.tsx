'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header, MainNavigation } from '@/components/dashboard';
import {
  Breadcrumb,
  ProgressStepper,
  ProductCard,
  AddressEditModal,
  MotorCarrierContact,
  ContactInfo
} from '@/components/submission';

export default function SubmissionPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user: authUser } = useMockAuth();
  
  const [selectedProducts, setSelectedProducts] = useState(['occupational_accident']);
  
  // State for validation
  const [contactValidationTriggered, setContactValidationTriggered] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);
  const [isMCContactValid, setIsMCContactValid] = useState(false);
  const [contactData, setContactData] = useState<any>(null);
  
  // DOT search state
  const [dotNumber, setDotNumber] = useState('');
  const [dotError, setDotError] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [isDOTValid, setIsDOTValid] = useState(false);
  const [carrierInfo, setCarrierInfo] = useState<{
    mcNumber: string;
    name: string;
    dbaName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    vehicles: number;
    warnings: string[];
    errors: string[];
    info: string[];
  } | null>(null);
  
  // Address edit modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressData, setAddressData] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });
  
  // Track accordion open/closed state
  const [openSections, setOpenSections] = useState({
    motorCarrier: true, // Open by default
    motorCarrierContact: true, // Open by default
    coverage: true
  });
  
  // Function to toggle accordion sections
  const toggleSection = (section: 'motorCarrier' | 'motorCarrierContact' | 'coverage') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Products data from Figma design
  const products = [
    {
      id: 'occupational_accident',
      title: 'Occupational Accident',
      description: 'Essential coverage for independent contractors who are not eligible for workers\' compensation. Protects drivers by covering medical expenses, disability benefits, and accidental death in the event of a work related injury.',
      iconSrc: '/images/medical-icon.svg',
      benefits: [
        { label: 'Aggregate Limit of Liability', value: '$2,000,000' },
        { label: 'Accidental Death Benefit', value: '$50,000 / 365 days' },
        { label: 'Survivors Benefit', value: 'up to $200,000 / up to $2,000 month' },
        { label: 'Acc Dismemberment Benefit', value: 'up to $250,000 / 365 days' },
        { label: 'Temporary Total Disability Benefit', value: '$125-700/week 10-104 weeks' },
        { label: 'Acc Med Expense Benefit', value: '$500,000' },
        { label: 'Continuous Total Disability', value: '$50-$700/week' },
        { label: 'Accidental Medical Expense', value: '$1,000,000' }
      ]
    },
    {
      id: 'non_trucking_liability',
      title: 'Non-Trucking Liability',
      description: 'Covers drivers when they are using the truck for non-business purposes, such as personal errands or commuting. This protection fills the gap when a driver is off dispatch, shielding them from potential liability claims that could otherwise be costly.',
      iconSrc: '/images/broker-business-icon.svg',
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
      benefits: [
        { label: 'Any one covered truck/covered trailer', value: '$250,000' },
        { label: 'Any one Policy', value: '$5,000,000' },
        { label: 'Limit', value: '$1,000,000' },
        { label: 'Cost per unit', value: '$300' }
      ]
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

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'New Submission', active: true }
  ];

  // Product selection handler
  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
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
  
  // Handler function for when contact data changes
  const handleContactDataChange = (data: ContactInfo) => {
    setContactData(data);
  };
  
  // Handler function for Motor Carrier Contact validation
  const handleMCContactValidationChange = (isValid: boolean) => {
    setIsMCContactValid(isValid);
  };

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
    let isContactValid = true;
    
    // Access the validateContactInfo function from the window object
    if (window.validateContactInfo) {
      isContactValid = window.validateContactInfo();
    }
    
    // If contact validation fails, scroll to that section
    if (!isContactValid) {
      setIsMCContactValid(false);
      document.getElementById('motorCarrierContactSection')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // At this point, all validations have passed
    setIsMCContactValid(true);
    
    // If all validations pass, proceed to next step
    router.push('/submission/dot');
  };

  // Memoized sections to prevent re-renders - Defined after all handler functions
  const motorCarrierContactSection = useMemo(() => (
    <div className="bg-white rounded border border-[#D8D8D8] mb-6">
      <button 
        className="flex justify-between items-center p-4 border-b border-[#D8D8D8] w-full"
        onClick={() => toggleSection('motorCarrierContact')}
      >
        <h2 className="text-xl font-semibold text-[#333333]">Motor Carrier Contact</h2>
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
        <div className="p-4">
          <p className="text-[#666666]">Contact information would go here</p>
        </div>
      )}
    </div>
  ), [openSections.motorCarrierContact, toggleSection]);

  const coverageSection = useMemo(() => (
    <div className="bg-white rounded border border-[#D8D8D8] mb-6">
      <button 
        className="flex justify-between items-center p-4 border-b border-[#D8D8D8] w-full"
        onClick={() => toggleSection('coverage')}
      >
        <h2 className="text-xl font-semibold text-[#333333]">Coverage</h2>
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
        {/* Products */}
        <div className="space-y-8">
          {products.map(product => (
            <div key={product.id} className="bg-white border border-[#D8D8D8] rounded-md overflow-hidden">
              <div className="flex">
                <div className="w-full md:w-1/3 p-6 bg-[#F2FBFC] border-r border-[#D8D8D8]">
                  <ProductCard
                    title={product.title}
                    description={product.description}
                    iconSrc={product.iconSrc}
                    isSelected={selectedProducts.includes(product.id)}
                    onSelect={() => handleProductSelect(product.id)}
                  />
                </div>
                
                <div className="w-full md:w-2/3">
                  <div className="p-4 bg-[#E6EEEF]">
                    <h3 className="font-semibold text-[#333333]">Included Benefits and Coverage</h3>
                  </div>
                  
                  <div className="p-4 md:grid md:grid-cols-2 gap-4">
                    {product.benefits.map((benefit, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-sm text-[#666666]">{benefit.label}</p>
                        <p className="font-semibold text-[#333333]">{benefit.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  ), [openSections.coverage, products, selectedProducts, handleProductSelect]);

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
      
      {/* Main Navigation */}
      <MainNavigation activeTab="submissions" />
      
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Main Content */}
      <div className="flex flex-row">
        {/* Left Sidebar - Progress Stepper */}
        <div className="min-w-[260px] border-r border-[#E6EEEF] shadow-sm bg-white">
          <ProgressStepper steps={steps} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8 bg-[#F9F8FB]">
          <h1 className="text-3xl font-bold text-[#333333] mb-6">New Submission</h1>
          
          {/* Motor Carrier (Insured) Section */}
          <div id="motorCarrierSection" className="bg-white rounded border border-[#E6EEEF] mb-6">
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
          <div id="motorCarrierContactSection" className="bg-white rounded border border-[#E6EEEF] mb-6">
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
              <MotorCarrierContact 
                dotAddressData={carrierInfo ? {
                  streetAddress: carrierInfo.address,
                  city: carrierInfo.city,
                  state: carrierInfo.state,
                  zipCode: carrierInfo.zipCode
                } : null}
                onValidationChange={handleMCContactValidationChange}
                onDataChange={handleContactDataChange}
                initialData={contactData}
              />
            )}
          </div>
          
          {/* Coverage Section - Updated with Figma styling */}
          <div className="bg-white rounded border border-[#E6EEEF] mb-6">
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
                {/* Products */}
                <div className="space-y-8">
                  {products.map(product => (
                    <div key={product.id} className="bg-white border border-[#D8D8D8] rounded-md overflow-hidden">
                      <div className="flex">
                        <div className="w-full md:w-1/3 p-6 bg-[#F2FBFC] border-r border-[#D8D8D8]">
                          <ProductCard
                            title={product.title}
                            description={product.description}
                            iconSrc={product.iconSrc}
                            isSelected={selectedProducts.includes(product.id)}
                            onSelect={() => handleProductSelect(product.id)}
                          />
                        </div>
                        
                        <div className="w-full md:w-2/3">
                          <div className="p-4 bg-[#E6EEEF]">
                            <h3 className="font-semibold text-[#333333]">Included Benefits and Coverage</h3>
                          </div>
                          
                          <div className="p-4 md:grid md:grid-cols-2 gap-4">
                            {product.benefits.map((benefit, index) => (
                              <div key={index} className="mb-2">
                                <p className="text-sm text-[#666666]">{benefit.label}</p>
                                <p className="font-semibold text-[#333333]">{benefit.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Button Bar */}
          <div className="flex justify-end mt-8 py-4 bg-[#E6EEEF] px-6">
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-[#007B87] text-white font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#005F69]"
            >
              Eligibility
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
      </div>

      {/* Address Edit Modal */}
      <AddressEditModal
        isOpen={isAddressModalOpen}
        onClose={closeAddressModal}
        addressData={addressData}
        onChange={handleAddressChange}
        onSubmit={handleAddressSubmit}
      />
    </div>
  );
}
