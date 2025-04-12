import React from 'react';
import { ResponsiveImage } from '@/components/ui';
import Link from 'next/link';

interface HeaderProps {
  user?: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <nav className="w-full bg-white border-b border-[#007B87] py-3 px-6">
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
          <span className="text-[#333333] font-bold text-xl ml-4 font-['Slate Std']">
            Commercial Trucking Insurance
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome,</p>
            <p className="font-medium">{user?.name || 'Broker'}</p>
          </div>
          <button 
            onClick={onLogout}
            className="border-2 border-[#007B87] text-[#007B87] font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-[#007B87] hover:text-white transition-colors"
          >
            My Profile
            <svg 
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={`transform transition-transform duration-200 rotate-180`}
            >
              <path d="M1.41 0.590088L6 5.17009L10.59 0.590088L12 2.00009L6 8.00009L0 2.00009L1.41 0.590088Z" fill="currentColor"/>
            </svg>
            
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
