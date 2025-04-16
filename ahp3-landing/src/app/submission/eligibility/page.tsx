'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { Header } from '@/components/dashboard';
import { Breadcrumb, ProgressStepper } from '@/components/submission';
import { Button } from '@/components/ui';
import useEligibilityStore from '@/store/useEligibilityStore';

export default function EligibilityPage() {
  const router = useRouter();
  const { isLoading, logout, user: authUser } = useMockAuth();
  
  // Get state and actions from Zustand store
  const {
    openSections,
    driverLeaseAgreement,
    independentContractors,
    vehicleTypes,
    selectedItems: storeSelectedItems,
    setOpenSection,
    setDriverLeaseAgreement,
    setIndependentContractors,
    setVehicleType,
    setSelectedItems
  } = useEligibilityStore();
  
  // State for validation errors (kept as local state since they don't need to persist)
  const [vehicleTypeErrors, setVehicleTypeErrors] = useState<{
    total: string;
    otherType: string;
  }>({
    total: '',
    otherType: ''
  });
  
  // State for driver agreements validation errors
  const [driverAgreementErrors, setDriverAgreementErrors] = useState<{
    driverLeaseAgreement: string;
    independentContractors: string;
  }>({
    driverLeaseAgreement: '',
    independentContractors: ''
  });

  // State for hauling validation errors
  const [haulingError, setHaulingError] = useState<string>('');
  
  // Calculate total vehicle type percentage
  const calculateTotal = () => {
    const numericFields = ['box', 'dump', 'flatbeds', 'intermodalContainer', 'refrigerated', 'tankers', 'other'];
    
    return numericFields.reduce((sum, field) => {
      const value = vehicleTypes[field as keyof typeof vehicleTypes];
      const numValue = value ? parseInt(value, 10) : 0;
      return isNaN(numValue) ? sum : sum + numValue;
    }, 0);
  };
  
  // Validate vehicle type fields
  const validateVehicleTypes = () => {
    const total = calculateTotal();
    const errors = {
      total: '',
      otherType: ''
    };
    
    // Validate total equals 100%
    if (total !== 100) {
      errors.total = `Total must equal 100%. Current total: ${total}%`;
    }
    
    // Validate otherType if other > 0
    const otherValue = parseInt(vehicleTypes.other, 10);
    if (!isNaN(otherValue) && otherValue > 0) {
      if (!vehicleTypes.otherType || vehicleTypes.otherType.trim() === '' || vehicleTypes.otherType.toLowerCase() === 'truck type') {
        errors.otherType = 'Please specify the other vehicle type';
      }
    }
    
    setVehicleTypeErrors(errors);
    return !errors.total && !errors.otherType;
  };
  
  // Validate driver agreements fields
  const validateDriverAgreements = () => {
    const errors = {
      driverLeaseAgreement: '',
      independentContractors: ''
    };
    
    // Check if driver lease agreement is selected
    if (driverLeaseAgreement === null) {
      errors.driverLeaseAgreement = 'Please select an option';
    }
    
    // Check if independent contractors is selected
    if (independentContractors === null) {
      errors.independentContractors = 'Please select an option';
    }
    
    setDriverAgreementErrors(errors);
    return !errors.driverLeaseAgreement && !errors.independentContractors;
  };
  
  // Validate hauling items
  const validateHauling = () => {
    if (storeSelectedItems.length === 0) {
      setHaulingError('Please select at least one item that drivers haul');
      return false;
    }
    setHaulingError('');
    return true;
  };

  // Agricultural products and bulk equipment options
  const agriculturalProducts = [
    { id: 'livestock', name: 'Livestock' },
    { id: 'unprocessedFood', name: 'Unprocessed Food' },
    { id: 'dairyProduct', name: 'Dairy Product' },
    { id: 'freshProduce', name: 'Fresh Produce' },
    { id: 'grains', name: 'Grains' },
    { id: 'farmSupplies', name: 'Farm Supplies' },
    { id: 'farmMachinery', name: 'Farm Machinery' },
  ];

  const bulkEquipment = [
    { id: 'heavyMachinery', name: 'Heavy Machinery' },
    { id: 'dumpTrucks', name: 'Dump Trucks' },
    { id: 'articulatedTractors', name: 'Articulated Tractors' },
    { id: 'articulatedDumpTrucks', name: 'Articulated Dump Trucks' },
    { id: 'excavators', name: 'Excavators' },
    { id: 'flatbedTrailers', name: 'Flatbed Trailers' },
    { id: 'stepDeckTrailers', name: 'Step-Deck Trailers' },
    { id: 'lowboyTrailers', name: 'Lowboy Trailers' },
    { id: 'rgnTrailers', name: 'RGN - Removable Gooseneck Trailers' },
    { id: 'dryVanTrailers', name: 'Dry Van or Enclosed Trailers' },
    { id: 'refrigeratedTrailers', name: 'Refrigerated Trailers' },
    { id: 'forklifts', name: 'Forklifts' },
    { id: 'conveyors', name: 'Conveyors' },
    { id: 'bucketElevators', name: 'Bucket Elevators' },
    { id: 'bulkHandlingCranes', name: 'Bulk-handling Cranes' },
  ];

  // State for search field
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Using storeSelectedItems from the Zustand store
  
  // Refs for handling outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Define interface for product options
  interface ProductOption {
    id: string;
    name: string;
  }

  // Define interface for filtered options
  interface FilteredOptions {
    agricultural: ProductOption[];
    bulk: ProductOption[];
  }

  // Function to search and filter options
  const getFilteredOptions = (): FilteredOptions => {
    // If dropdown is closed and search term is less than 3 chars, return empty results
    if (!isDropdownOpen && searchTerm.length < 3) {
      return { agricultural: [], bulk: [] };
    }
    
    // If dropdown is open and no search term, show all options
    if (isDropdownOpen && searchTerm.length === 0) {
      return {
        agricultural: agriculturalProducts,
        bulk: bulkEquipment
      };
    }
    
    // Filter based on search term (case insensitive)
    const searchTermLower = searchTerm.toLowerCase();
    const filteredAgricultural = agriculturalProducts.filter(item => 
      item.name.toLowerCase().includes(searchTermLower)
    );
    
    const filteredBulk = bulkEquipment.filter(item => 
      item.name.toLowerCase().includes(searchTermLower)
    );
    
    return { 
      agricultural: filteredAgricultural, 
      bulk: filteredBulk 
    };
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    // Open dropdown when:
    // 1. User enters 3+ characters (for search filtering)
    // 2. User clears the search field (to show all options)
    // 3. User is actively typing (to show real-time filtering)
    if (newSearchTerm.length >= 3 || newSearchTerm.length === 0 || searchTerm.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle item selection
  const handleItemSelect = (item: ProductOption, type: 'agricultural' | 'bulk') => {
    // Check if item is already selected
    const isAlreadySelected = storeSelectedItems.some((selected: {id: string}) => selected.id === item.id);
    
    if (isAlreadySelected) {
      // Remove item from selected items
      setSelectedItems(storeSelectedItems.filter((selected: {id: string}) => selected.id !== item.id));
    } else {
      // Add item to selected items
      setSelectedItems([...storeSelectedItems, {...item, type}]);
    }
  };

  // Function to toggle accordion sections
  const toggleSection = (section: 'driverAgreements' | 'vehicleTypes' | 'hauling') => {
    setOpenSection(section, !openSections[section]);
  };
  
  // Update vehicle type percentage
  const handleVehicleTypeChange = (type: keyof typeof vehicleTypes, value: string) => {
    // For numeric fields, only allow digits
    const numericFields = ['box', 'dump', 'flatbeds', 'intermodalContainer', 'refrigerated', 'tankers', 'other'];
    
    if (numericFields.includes(type)) {
      // Only allow digits
      if (!/^\d*$/.test(value)) {
        return; // Reject non-numeric input
      }
    }
    
    setVehicleType(type, value);
    
    // Validate after each change
    setTimeout(() => validateVehicleTypes(), 0);
  };
  
  // Navigation handlers
  const handlePreviousStep = () => {
    router.push('/submission');
  };
  
  const handleNextStep = () => {
    // Validate driver agreements first
    const isDriverAgreementsValid = validateDriverAgreements();
    
    if (!isDriverAgreementsValid) {
      // Ensure the driver agreements section is open to show errors
      setOpenSection('driverAgreements', true);
      
      // Scroll to the driver agreements section
      setTimeout(() => {
        const driverAgreementsSection = document.getElementById('driver-agreements-section');
        if (driverAgreementsSection) {
          driverAgreementsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      return;
    }
    
    // Then validate vehicle types
    const isVehicleTypesValid = validateVehicleTypes();
    
    if (!isVehicleTypesValid) {
      // Ensure the vehicle types section is open to show errors
      setOpenSection('vehicleTypes', true);
      
      // Scroll to the vehicle types section
      setTimeout(() => {
        const vehicleTypesSection = document.getElementById('vehicle-types-section');
        if (vehicleTypesSection) {
          vehicleTypesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      return;
    }
    
    // Validate hauling items
    const isHaulingValid = validateHauling();
    
    if (!isHaulingValid) {
      // Ensure the hauling section is open to show errors
      setOpenSection('hauling', true);
      
      // Scroll to the hauling section
      setTimeout(() => {
        const haulingSection = document.getElementById('hauling-section');
        if (haulingSection) {
          haulingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      return;
    }
    
    // If all validations pass, proceed to next step
    router.push('/submission/loss-history');
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        dropdownRef.current &&
        !searchContainerRef.current.contains(event.target as Node) && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
      isActive: true,
      isCompleted: false,
      subsections: [
        { title: 'Driver Agreements', isActive: true },
        { title: 'Vehicles', isActive: false },
        { title: 'Hauling', isActive: false },
        { title: 'Loss History', isActive: false }
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
          
          {/* Driver Agreements Section */}
          <div id="driver-agreements-section" className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('driverAgreements')}
            >
              <h2 className="text-2xl font-semibold text-[#333333] leading-[1.333em]">Driver Agreements</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform duration-300 ${openSections.driverAgreements ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.driverAgreements && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <p className="text-base font-semibold text-[#333333] mb-1">
                        Do the drivers sign an independent contractor lease agreement that states they are under permanent lease to the Motor Carrier?
                      </p>
                    </div>
                    <div className="ml-2">
                      <button 
                        className="text-[#007B87]"
                        title="More information"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="#007B87"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex gap-4">
                      <label className={`flex items-center cursor-pointer p-3 border ${driverAgreementErrors.driverLeaseAgreement ? 'border-red-500' : 'border-[#D8D8D8]'} rounded`}>
                        <input 
                          type="radio" 
                          name="driverLeaseAgreement" 
                          value="yes" 
                          checked={driverLeaseAgreement === 'yes'}
                          onChange={() => {
                          setDriverLeaseAgreement('yes');
                          validateDriverAgreements();
                        }}
                        onBlur={validateDriverAgreements}
                          className="w-4 h-4 mr-2 text-[#007B87] border-gray-300"
                        />
                        <span className="text-[#333333]">Yes</span>
                      </label>
                      <label className={`flex items-center cursor-pointer p-3 border ${driverAgreementErrors.driverLeaseAgreement ? 'border-red-500' : 'border-[#D8D8D8]'} rounded`}>
                        <input 
                          type="radio" 
                          name="driverLeaseAgreement" 
                          value="no"
                          checked={driverLeaseAgreement === 'no'}
                          onChange={() => {
                            setDriverLeaseAgreement('no');
                            validateDriverAgreements();
                          }}
                          onBlur={validateDriverAgreements}
                          className="w-4 h-4 mr-2 text-[#007B87] border-gray-300"
                        />
                        <span className="text-[#333333]">No</span>
                      </label>
                    </div>
                    {driverAgreementErrors.driverLeaseAgreement && (
                      <p className="text-red-500 text-sm mt-1">
                        {driverAgreementErrors.driverLeaseAgreement}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-base font-semibold text-[#333333] mb-4">
                    Are independent contractors operating equipment owned or leased by the Motor Carrier without a vehicle lease agreement?
                  </p>
                  <div className="flex flex-col">
                    <div className="flex gap-4">
                      <label className={`flex items-center cursor-pointer p-3 border ${driverAgreementErrors.independentContractors ? 'border-red-500' : 'border-[#D8D8D8]'} rounded`}>
                        <input 
                          type="radio" 
                          name="independentContractors" 
                          value="yes"
                          checked={independentContractors === 'yes'}
                          onChange={() => {
                            setIndependentContractors('yes');
                            validateDriverAgreements();
                          }}
                          onBlur={validateDriverAgreements}
                          className="w-4 h-4 mr-2 text-[#007B87] border-gray-300"
                        />
                        <span className="text-[#333333]">Yes</span>
                      </label>
                      <label className={`flex items-center cursor-pointer p-3 border ${driverAgreementErrors.independentContractors ? 'border-red-500' : 'border-[#D8D8D8]'} rounded`}>
                        <input 
                          type="radio" 
                          name="independentContractors" 
                          value="no"
                          checked={independentContractors === 'no'}
                          onChange={() => {
                            setIndependentContractors('no');
                            validateDriverAgreements();
                          }}
                          onBlur={validateDriverAgreements}
                          className="w-4 h-4 mr-2 text-[#007B87] border-gray-300"
                        />
                        <span className="text-[#333333]">No</span>
                      </label>
                    </div>
                    {driverAgreementErrors.independentContractors && (
                      <p className="text-red-500 text-sm mt-1">
                        {driverAgreementErrors.independentContractors}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Vehicle Types Section */}
          <div id="vehicle-types-section" className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('vehicleTypes')}
            >
              <h2 className="text-2xl font-semibold text-[#333333] leading-[1.333em]">Vehicle Types</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform duration-300 ${openSections.vehicleTypes ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.vehicleTypes && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                <div className="mb-6">
                  <p className="text-base font-semibold text-[#333333] mb-4">What are the vehicle types?</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col">
                      <label className="text-[#333333] font-semibold mb-1">% Box</label>
                      <input
                        type="text"
                        value={vehicleTypes.box}
                        onChange={(e) => handleVehicleTypeChange('box', e.target.value)}
                        onBlur={validateVehicleTypes}
                        className="border border-[#D8D8D8] rounded p-2"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-[#333333] font-semibold mb-1">% Dump</label>
                      <input
                        type="text"
                        value={vehicleTypes.dump}
                        onChange={(e) => handleVehicleTypeChange('dump', e.target.value)}
                        onBlur={validateVehicleTypes}
                        className="border border-[#D8D8D8] rounded p-2"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-[#333333] font-semibold mb-1">% Flatbeds</label>
                      <input
                        type="text"
                        value={vehicleTypes.flatbeds}
                        onChange={(e) => handleVehicleTypeChange('flatbeds', e.target.value)}
                        onBlur={validateVehicleTypes}
                        className="border border-[#D8D8D8] rounded p-2"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-[#333333] font-semibold mb-1">% Intermodal Container</label>
                      <input
                        type="text"
                        value={vehicleTypes.intermodalContainer}
                        onChange={(e) => handleVehicleTypeChange('intermodalContainer', e.target.value)}
                        onBlur={validateVehicleTypes}
                        className="border border-[#D8D8D8] rounded p-2"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-[#333333] font-semibold mb-1">% Refrigerated</label>
                      <input
                        type="text"
                        value={vehicleTypes.refrigerated}
                        onChange={(e) => handleVehicleTypeChange('refrigerated', e.target.value)}
                        onBlur={validateVehicleTypes}
                        className="border border-[#D8D8D8] rounded p-2"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-[#333333] font-semibold mb-1">% Tankers</label>
                      <input
                        type="text"
                        value={vehicleTypes.tankers}
                        onChange={(e) => handleVehicleTypeChange('tankers', e.target.value)}
                        onBlur={validateVehicleTypes}
                        className="border border-[#D8D8D8] rounded p-2"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col">
                      <label className="text-[#333333] font-semibold mb-1">% Other</label>
                      <input
                        type="text"
                        value={vehicleTypes.other}
                        onChange={(e) => handleVehicleTypeChange('other', e.target.value)}
                        onBlur={validateVehicleTypes}
                        className="border border-[#D8D8D8] rounded p-2"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-[#333333] font-semibold mb-1">Other type</label>
                      <input
                        type="text"
                        value={vehicleTypes.otherType}
                        onChange={(e) => handleVehicleTypeChange('otherType', e.target.value)}
                        onBlur={validateVehicleTypes}
                        className={`border rounded p-2 ${
                          vehicleTypeErrors.otherType ? 'border-red-500' : 'border-[#D8D8D8]'
                        }`}
                      />
                      {vehicleTypeErrors.otherType && (
                        <p className="text-red-500 text-sm mt-1">{vehicleTypeErrors.otherType}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-[#333333] font-semibold mb-1">Total</label>
                    <input
                      type="text"
                      value={`${calculateTotal()}%`}
                      readOnly
                      className={`border rounded p-2 bg-[#F0F0F0] ${calculateTotal() !== 100 ? 'border-red-500' : 'border-[#D8D8D8]'}`}
                    />
                    {calculateTotal() !== 100 && (
                      <p className="text-red-500 text-sm mt-1">
                        Total must equal 100%. Current total: {calculateTotal()}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Hauling Section */}
          <div id="hauling-section" className="w-full mb-6">
            <button 
              className="flex justify-between items-center p-[14px_12px] bg-[#F9F8FB] border-b border-[#E6EEEF] w-full"
              onClick={() => toggleSection('hauling')}
            >
              <h2 className="text-2xl font-semibold text-[#333333] leading-[1.333em]">Hauling</h2>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform duration-300 ${openSections.hauling ? 'rotate-180' : ''}`}
              >
                <path d="M6 9L12 15L18 9" stroke="#007B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {openSections.hauling && (
              <div className="p-6 bg-white border border-[#D8D8D8] border-t-0">
                <div className="mb-6">
                  <p className="text-base font-semibold text-[#333333] mb-4">What do drivers haul?</p>
                  
                  {haulingError && (
                    <div className="bg-[#FFE6EC] border border-[#C60C30] rounded-md p-3 mb-4">
                      <p className="text-sm text-[#C60C30]">{haulingError}</p>
                    </div>
                  )}
                  
                  <div className="mb-4 relative" ref={searchContainerRef}>
                    <p className="text-sm text-[#333333] mb-2">Search for materials hauled</p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="search"
                        className="block w-full p-2 pl-10 pr-10 text-sm border border-[#D8D8D8] rounded"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setIsDropdownOpen(true)}
                      />
                      <Button
                        variant="text"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 m-0 p-0 h-full"
                        onClick={toggleDropdown}
                      >
                        <svg 
                          className={`w-4 h-4 text-[#007B87] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 9L12 15L18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Button>
                    </div>
                    
                    {/* Dropdown Menu with Animation */}
                    <div 
                      ref={dropdownRef}
                      className={`absolute z-10 mt-1 w-full bg-white border border-[#D8D8D8] rounded shadow-lg transition-all duration-300 ease-in-out ${
                        isDropdownOpen
                          ? 'opacity-100 max-h-96 overflow-y-auto'
                          : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
                      }`}
                    >
                      {getFilteredOptions().agricultural.length > 0 && (
                        <>
                          <div className="bg-[#F0F0F0] p-2 border-b border-[#D8D8D8] font-semibold sticky top-0">
                            Agricultural Products
                          </div>
                          {getFilteredOptions().agricultural.map((item) => (
                            <div 
                              key={item.id} 
                              className="border-b border-[#D8D8D8] p-2 flex items-center hover:bg-[#F2FBFC] cursor-pointer transition-colors duration-150"
                              onClick={() => handleItemSelect(item, 'agricultural')}
                            >
                              <input 
                                type="checkbox" 
                                className="mr-2 cursor-pointer accent-[#007B87]" 
                                checked={storeSelectedItems.some((selected: {id: string}) => selected.id === item.id)}
                                readOnly
                              />
                              <span>{item.name}</span>
                            </div>
                          ))}
                        </>
                      )}
                      
                      {getFilteredOptions().bulk.length > 0 && (
                        <>
                          <div className="bg-[#F0F0F0] p-2 border-b border-[#D8D8D8] font-semibold sticky top-0">
                            Bulky Equipment
                          </div>
                          {getFilteredOptions().bulk.map((item) => (
                            <div 
                              key={item.id} 
                              className="border-b border-[#D8D8D8] p-2 flex items-center hover:bg-[#F2FBFC] cursor-pointer transition-colors duration-150"
                              onClick={() => handleItemSelect(item, 'bulk')}
                            >
                              <input 
                                type="checkbox" 
                                className="mr-2 cursor-pointer accent-[#5A6B8C]" 
                                checked={storeSelectedItems.some((selected: {id: string}) => selected.id === item.id)}
                                readOnly
                              />
                              <span>{item.name}</span>
                            </div>
                          ))}
                        </>
                      )}
                      
                      {getFilteredOptions().agricultural.length === 0 && getFilteredOptions().bulk.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          No matching items found
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Selected Items Display */}
                  {storeSelectedItems.length > 0 && (
                    <div className="mb-4">
                      <p className="text-base font-semibold text-[#333333] mb-2">Selected items:</p>
                      <div className="flex flex-wrap gap-2">
                        {storeSelectedItems.map((item: {id: string, name: string, type: 'agricultural' | 'bulk'}) => (
                          <div 
                            key={item.id} 
                            className={`px-3 py-1 rounded-full text-white text-sm flex items-center transition-all duration-200 hover:opacity-90 ${
                              item.type === 'agricultural' ? 'bg-[#007B87]' : 'bg-[#5A6B8C]'
                            }`}
                          >
                            {item.name}
                            <Button 
                              variant="text"
                              className="ml-2 p-0 m-0" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemSelect(item, item.type);
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
          Coverage and Motor Carrier
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
          Loss History
        </Button>

      </div>
    </div>
  );
}
