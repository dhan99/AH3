'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { ResponsiveImage } from '@/components/ui';
import Link from 'next/link';

export default function DotQuestionnaire() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useMockAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    dotNumber: '',
    mcNumber: '',
    entityType: '',
    yearsInBusiness: '',
    primaryOperatingState: '',
    operatingRadius: '',
    cargoTypes: [] as string[],
    otherCargoType: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargo type options
  const cargoTypeOptions = [
    'General Freight',
    'Household Goods',
    'Metal: sheets, coils, rolls',
    'Fresh Produce',
    'Grain, Feed, Hay',
    'Dry Bulk',
    'Liquids/Gas',
    'Intermodal Containers',
    'Passengers',
    'Oilfield Equipment',
    'Livestock',
    'Refrigerated Food',
    'Beverages',
    'Paper Products',
    'Utilities',
    'Agricultural/Farm Supplies',
    'Construction',
    'Water Well',
    'Other'
  ];

  // State options
  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCargoTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        cargoTypes: [...prev.cargoTypes, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        cargoTypes: prev.cargoTypes.filter(type => type !== value)
      }));
    }
    
    // Clear error when field is edited
    if (errors.cargoTypes) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cargoTypes;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.dotNumber.trim()) {
      newErrors.dotNumber = 'DOT number is required';
    } else if (!/^\d+$/.test(formData.dotNumber)) {
      newErrors.dotNumber = 'DOT number must contain only digits';
    }
    
    if (formData.mcNumber && !/^\d+$/.test(formData.mcNumber)) {
      newErrors.mcNumber = 'MC number must contain only digits';
    }
    
    if (!formData.entityType) {
      newErrors.entityType = 'Entity type is required';
    }
    
    if (!formData.yearsInBusiness.trim()) {
      newErrors.yearsInBusiness = 'Years in business is required';
    } else if (isNaN(Number(formData.yearsInBusiness)) || Number(formData.yearsInBusiness) < 0) {
      newErrors.yearsInBusiness = 'Please enter a valid number';
    }
    
    if (!formData.primaryOperatingState) {
      newErrors.primaryOperatingState = 'Primary operating state is required';
    }
    
    if (!formData.operatingRadius) {
      newErrors.operatingRadius = 'Operating radius is required';
    }
    
    if (formData.cargoTypes.length === 0) {
      newErrors.cargoTypes = 'At least one cargo type is required';
    }
    
    if (formData.cargoTypes.includes('Other') && !formData.otherCargoType.trim()) {
      newErrors.otherCargoType = 'Please specify the other cargo type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // In a real application, you would save this data to your backend
      // For now, we'll just simulate a delay and then navigate to the next step
      setTimeout(() => {
        setIsSubmitting(false);
        // Navigate to the eligibility page
        router.push('/submission/eligibility');
      }, 1000);
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="w-full bg-white border-b border-[#007B87] py-3 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center">
              <ResponsiveImage 
                src="/images/intact-logo.svg" 
                alt="Intact Insurance Logo" 
                width={120} 
                height={40} 
                priority
              />
            </Link>
            <span className="text-[#333333] font-medium text-lg ml-4 font-['Slate Std']">
              New Submission
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="text-[#007B87] font-semibold hover:underline"
            >
              Back to Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="border-2 border-[#007B87] text-[#007B87] font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-[#007B87] hover:text-white transition-colors"
            >
              Logout
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12V15C12 15.2652 11.8946 15.5196 11.7071 15.7071C11.5196 15.8946 11.2652 16 11 16H1C0.734784 16 0.48043 15.8946 0.292893 15.7071C0.105357 15.5196 0 15.2652 0 15V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H11C11.2652 0 11.5196 0.105357 11.7071 0.292893C11.8946 0.48043 12 0.734784 12 1V4H10V2H2V14H10V12H12Z" fill="currentColor"/>
                <path d="M16 8L12 4V7H5V9H12V12L16 8Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#007B87] text-white flex items-center justify-center font-semibold">
                ✓
              </div>
              <span className="text-sm mt-1 font-medium text-[#007B87]">Coverage</span>
            </div>
            <div className="flex-1 h-1 bg-[#007B87] mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#007B87] text-white flex items-center justify-center font-semibold">
                2
              </div>
              <span className="text-sm mt-1 font-medium text-[#007B87]">DOT Info</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div className="h-full w-0 bg-[#007B87]"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
                3
              </div>
              <span className="text-sm mt-1 text-gray-500">Eligibility</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#333333] mb-2">DOT Information</h1>
          <p className="text-gray-600 mb-8">
            Please provide information about the Motor Carrier's DOT details.
          </p>
          
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="dotNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  DOT Number*
                </label>
                <input
                  type="text"
                  id="dotNumber"
                  name="dotNumber"
                  value={formData.dotNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.dotNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                  placeholder="Enter DOT number"
                />
                {errors.dotNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.dotNumber}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="mcNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  MC Number (if applicable)
                </label>
                <input
                  type="text"
                  id="mcNumber"
                  name="mcNumber"
                  value={formData.mcNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.mcNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                  placeholder="Enter MC number"
                />
                {errors.mcNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.mcNumber}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 mb-1">
                  Entity Type*
                </label>
                <select
                  id="entityType"
                  name="entityType"
                  value={formData.entityType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.entityType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                >
                  <option value="">Select entity type</option>
                  <option value="individual">Individual/Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="corporation">Corporation</option>
                  <option value="llc">LLC</option>
                  <option value="other">Other</option>
                </select>
                {errors.entityType && (
                  <p className="mt-1 text-sm text-red-500">{errors.entityType}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700 mb-1">
                  Years in Business*
                </label>
                <input
                  type="number"
                  id="yearsInBusiness"
                  name="yearsInBusiness"
                  value={formData.yearsInBusiness}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border ${errors.yearsInBusiness ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                  placeholder="Enter years in business"
                />
                {errors.yearsInBusiness && (
                  <p className="mt-1 text-sm text-red-500">{errors.yearsInBusiness}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="primaryOperatingState" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Operating State*
                </label>
                <select
                  id="primaryOperatingState"
                  name="primaryOperatingState"
                  value={formData.primaryOperatingState}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.primaryOperatingState ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                >
                  <option value="">Select state</option>
                  {stateOptions.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.primaryOperatingState && (
                  <p className="mt-1 text-sm text-red-500">{errors.primaryOperatingState}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="operatingRadius" className="block text-sm font-medium text-gray-700 mb-1">
                  Operating Radius*
                </label>
                <select
                  id="operatingRadius"
                  name="operatingRadius"
                  value={formData.operatingRadius}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.operatingRadius ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                >
                  <option value="">Select operating radius</option>
                  <option value="local">Local (&lt; 50 miles)</option>
                  <option value="intrastate">Intrastate (within one state)</option>
                  <option value="regional">Regional (&lt; 500 miles)</option>
                  <option value="longHaul">Long Haul (&gt; 500 miles)</option>
                </select>
                {errors.operatingRadius && (
                  <p className="mt-1 text-sm text-red-500">{errors.operatingRadius}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo Types* (select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {cargoTypeOptions.map(cargo => (
                  <div key={cargo} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`cargo-${cargo}`}
                      name="cargoTypes"
                      value={cargo}
                      checked={formData.cargoTypes.includes(cargo)}
                      onChange={handleCargoTypeChange}
                      className="h-4 w-4 text-[#007B87] focus:ring-[#007B87] border-gray-300 rounded"
                    />
                    <label htmlFor={`cargo-${cargo}`} className="ml-2 text-sm text-gray-700">
                      {cargo}
                    </label>
                  </div>
                ))}
              </div>
              {errors.cargoTypes && (
                <p className="mt-1 text-sm text-red-500">{errors.cargoTypes}</p>
              )}
            </div>
            
            {formData.cargoTypes.includes('Other') && (
              <div className="mb-6">
                <label htmlFor="otherCargoType" className="block text-sm font-medium text-gray-700 mb-1">
                  Specify Other Cargo Type*
                </label>
                <input
                  type="text"
                  id="otherCargoType"
                  name="otherCargoType"
                  value={formData.otherCargoType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.otherCargoType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                  placeholder="Please specify other cargo type"
                />
                {errors.otherCargoType && (
                  <p className="mt-1 text-sm text-red-500">{errors.otherCargoType}</p>
                )}
              </div>
            )}
            
            <div className="flex justify-between">
              <Link
                href="/submission/coverage"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                  <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
                </svg>
                Previous Step
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#007B87] text-white font-semibold px-6 py-2 rounded flex items-center gap-2 hover:bg-[#005F69] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Next Step
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
