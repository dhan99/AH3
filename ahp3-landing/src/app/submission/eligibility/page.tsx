'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import { ResponsiveImage } from '@/components/ui';
import Link from 'next/link';

export default function EligibilityCheck() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useMockAuth();
  
  // Eligibility state
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [quoteDetails, setQuoteDetails] = useState({
    quoteId: '',
    premium: '',
    coverageType: 'Occupational Accident',
    effectiveDate: '',
    expirationDate: ''
  });

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Simulate eligibility check
    const checkEligibility = () => {
      // In a real application, this would be an API call to check eligibility
      // based on the data collected in the previous steps
      setTimeout(() => {
        // For demo purposes, we'll randomly determine eligibility
        const eligible = Math.random() > 0.3; // 70% chance of being eligible
        setIsEligible(eligible);
        setIsChecking(false);
        
        if (eligible) {
          // Generate a random quote ID
          const quoteId = 'Q' + Math.floor(100000 + Math.random() * 900000);
          
          // Generate a random premium between $1,000 and $5,000
          const premium = (1000 + Math.random() * 4000).toFixed(2);
          
          // Set effective date to today
          const effectiveDate = new Date();
          
          // Set expiration date to 1 year from today
          const expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
          
          setQuoteDetails({
            quoteId,
            premium,
            coverageType: 'Occupational Accident',
            effectiveDate: effectiveDate.toLocaleDateString(),
            expirationDate: expirationDate.toLocaleDateString()
          });
        }
      }, 2000);
    };
    
    checkEligibility();
  }, []);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
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
                ✓
              </div>
              <span className="text-sm mt-1 font-medium text-[#007B87]">DOT Info</span>
            </div>
            <div className="flex-1 h-1 bg-[#007B87] mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#007B87] text-white flex items-center justify-center font-semibold">
                3
              </div>
              <span className="text-sm mt-1 font-medium text-[#007B87]">Eligibility</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Eligibility Check</h1>
          <p className="text-gray-600 mb-8">
            We're checking if the Motor Carrier is eligible for coverage based on the information provided.
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            {isChecking ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-[#007B87] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold mb-2">Checking Eligibility</h2>
                <p className="text-gray-600">
                  Please wait while we check if the Motor Carrier is eligible for coverage...
                </p>
              </div>
            ) : isEligible ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-green-600">Eligible for Coverage</h2>
                <p className="text-gray-600 mb-6">
                  Great news! The Motor Carrier is eligible for coverage. Here's your quote:
                </p>
                
                <div className="border border-gray-200 rounded-lg p-4 mb-6 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Quote ID</p>
                      <p className="font-medium">{quoteDetails.quoteId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Premium</p>
                      <p className="font-medium">${quoteDetails.premium}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Coverage Type</p>
                      <p className="font-medium">{quoteDetails.coverageType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Effective Date</p>
                      <p className="font-medium">{quoteDetails.effectiveDate}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Expiration Date</p>
                      <p className="font-medium">{quoteDetails.expirationDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-[#007B87] text-white font-semibold px-6 py-3 rounded hover:bg-[#005F69] transition-colors">
                    Purchase Policy
                  </button>
                  <button className="border border-[#007B87] text-[#007B87] font-semibold px-6 py-3 rounded hover:bg-gray-50 transition-colors">
                    Download Quote
                  </button>
                  <button className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded hover:bg-gray-50 transition-colors">
                    Email Quote
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-red-600">Not Eligible for Coverage</h2>
                <p className="text-gray-600 mb-6">
                  Unfortunately, the Motor Carrier is not eligible for coverage at this time. This could be due to various factors such as:
                </p>
                
                <ul className="text-left list-disc list-inside mb-6">
                  <li className="mb-2">Operating history or experience</li>
                  <li className="mb-2">Safety record or violations</li>
                  <li className="mb-2">Type of cargo transported</li>
                  <li className="mb-2">Geographic operating area</li>
                  <li>Other underwriting criteria</li>
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/dashboard"
                    className="bg-[#007B87] text-white font-semibold px-6 py-3 rounded hover:bg-[#005F69] transition-colors"
                  >
                    Return to Dashboard
                  </Link>
                  <button className="border border-[#007B87] text-[#007B87] font-semibold px-6 py-3 rounded hover:bg-gray-50 transition-colors">
                    Contact Underwriter
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-between">
            <Link
              href="/submission/dot"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
              </svg>
              Previous Step
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
