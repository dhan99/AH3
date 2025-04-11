'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { ResponsiveImage } from '@/components/ui';
import Link from 'next/link';

export default function CoverageQuestionnaire() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useMockAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    coverageType: '',
    effectiveDate: '',
    numberOfDrivers: '',
    additionalNotes: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.coverageType) {
      newErrors.coverageType = 'Coverage type is required';
    }
    
    if (!formData.effectiveDate) {
      newErrors.effectiveDate = 'Effective date is required';
    }
    
    if (!formData.numberOfDrivers) {
      newErrors.numberOfDrivers = 'Number of drivers is required';
    } else if (isNaN(Number(formData.numberOfDrivers)) || Number(formData.numberOfDrivers) <= 0) {
      newErrors.numberOfDrivers = 'Please enter a valid number';
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
        // Navigate to the DOT questionnaire page
        router.push('/submission/dot');
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
                1
              </div>
              <span className="text-sm mt-1 font-medium text-[#007B87]">Coverage</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div className="h-full w-0 bg-[#007B87]"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
                2
              </div>
              <span className="text-sm mt-1 text-gray-500">DOT Info</span>
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
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Coverage Information</h1>
          <p className="text-gray-600 mb-8">
            Please provide information about the Motor Carrier and the coverage they need.
          </p>
          
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name*
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                  placeholder="Enter company name"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name*
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.contactName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                  placeholder="Enter contact name"
                />
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-500">{errors.contactName}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="coverageType" className="block text-sm font-medium text-gray-700 mb-1">
                Coverage Type*
              </label>
              <select
                id="coverageType"
                name="coverageType"
                value={formData.coverageType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.coverageType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
              >
                <option value="">Select coverage type</option>
                <option value="occupational_accident">Occupational Accident</option>
                <option value="non_trucking_liability">Non-Trucking Liability</option>
                <option value="physical_damage">Physical Damage</option>
                <option value="workers_comp">Workers Compensation</option>
              </select>
              {errors.coverageType && (
                <p className="mt-1 text-sm text-red-500">{errors.coverageType}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Date*
                </label>
                <input
                  type="date"
                  id="effectiveDate"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.effectiveDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                />
                {errors.effectiveDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.effectiveDate}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="numberOfDrivers" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Drivers*
                </label>
                <input
                  type="number"
                  id="numberOfDrivers"
                  name="numberOfDrivers"
                  value={formData.numberOfDrivers}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border ${errors.numberOfDrivers ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]`}
                  placeholder="Enter number of drivers"
                />
                {errors.numberOfDrivers && (
                  <p className="mt-1 text-sm text-red-500">{errors.numberOfDrivers}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                placeholder="Enter any additional information"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <Link
                href="/dashboard"
                className="mr-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
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
