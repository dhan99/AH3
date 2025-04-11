'use client';

import { ResponsiveImage } from '@/components/ui';
import { useMockAuth } from '@/components/MockAuthProvider';
import { useState, useRef, useEffect } from 'react';

export const HeroSection = () => {
  const { loginWithRedirect } = useMockAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = (userType: string) => {
    console.log(`Logging in as: ${userType}`);
    loginWithRedirect();
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="relative w-full">
      {/* Hero section with background image on the right */}
      <div className="relative h-[600px]">
        {/* Right-side background image with overlay */}
        <div className="absolute top-0 right-0 bottom-0 w-1/2 z-0 overflow-hidden">
          <ResponsiveImage
            src="/images/hero-background.jpg"
            alt="Trucking"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          {/* Transparent gradient overlay */}
          <div className="absolute inset-y-0 w-10 bg-gradient-to-l from-transparent to-white/90"></div>
        </div>
        {/* Left-side gradient background */}
        <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-white z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center">
          <div className="max-w-lg px-6 py-12">
            <p className="text-xl font-semibold mb-2 text-[#757575] font-['Gibson']">GET STARTED</p>
            <h1 className="text-4xl font-light mb-6 text-[#333333] font-['Gibson']">
              Trucking Insurance
            </h1>
            <p className="text-base font-light mb-8 text-[#333333] font-['Gibson']">
              Intact Insurance A&H producers can secure an occupational accident, non-trucking liability or vehicle physical liability policy online with minimal data entry and accelerated processing times, backed by an A+ rating*.
            </p>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-[#C60C30] text-white font-semibold px-6 py-4 rounded text-m uppercase tracking-wider hover:bg-[#a00926] transition-colors font-['Gibson'] flex items-center gap-2"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                LOGIN
                <svg 
                  width="12" 
                  height="8" 
                  viewBox="0 0 12 8" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M1.41 0.590088L6 5.17009L10.59 0.590088L12 2.00009L6 8.00009L0 2.00009L1.41 0.590088Z" fill="currentColor"/>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {['Brokers', 'Motor Carriers', 'Drivers'].map((userType) => (
                      <button
                        key={userType}
                        onClick={() => handleLogin(userType)}
                        className="w-full text-left block px-4 py-2 text-m text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-['Gibson']"
                        role="menuitem"
                      >
                        {userType}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Blue bar at bottom */}
        {/*<div className="absolute bottom-0 left-0 right-0 h-16 bg-[#004248] z-10"></div>*/}
      </div>
    </section>
  );
};
