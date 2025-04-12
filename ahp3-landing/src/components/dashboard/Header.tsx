import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveImage } from '@/components/ui';
import Link from 'next/link';

interface HeaderProps {
  user?: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleMenuItemClick = (option: string) => {
    console.log(`Selected: ${option}`);
    onLogout();
  };
  return (
    <nav className="w-full bg-white border-b border-[#007B87] py-5 px-6">
      <div className="w-full flex justify-between items-center">
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
          <span className="text-[#333333] font-bold text-3xl ml-4 font-['Slate Std']">
            Commercial Trucking Insurance
          </span>
        </div>
        <div className="flex items-center gap-0">
          {/*
          <div className="text-right mr-2">
            <p className="text-sm text-gray-600">Welcome,</p>
            <p className="font-medium">{user?.name || 'Demo Broker'}</p>
          </div>
          */}
          <div className="w-8 h-8 mt-1 flex-shrink-0">
            <ResponsiveImage 
              src="/images/person2-icon.svg" 
              alt="Placeholder text to come"
              width={8} 
              height={8} 
            />
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="border-0 border-[#007B87] text-[#007B87] text-lg font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-[#007B87] hover:text-white transition-colors"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              My Profile
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
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {['Account', 'Sign Off'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleMenuItemClick(option)}
                      className="w-full text-left block px-4 py-2 text-m text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
