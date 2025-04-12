import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  user?: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <nav className="w-full bg-white border-b border-[#007B87] py-3 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center">
            <Image 
              src="/images/intact-logo.svg" 
              alt="Intact Insurance Logo" 
              width={120} 
              height={40} 
              priority
            />
          </Link>
          <span className="text-[#333333] font-medium text-lg ml-4 font-['Slate_Std']">
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12V15C12 15.2652 11.8946 15.5196 11.7071 15.7071C11.5196 15.8946 11.2652 16 11 16H1C0.734784 16 0.48043 15.8946 0.292893 15.7071C0.105357 15.5196 0 15.2652 0 15V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H11C11.2652 0 11.5196 0.105357 11.7071 0.292893C11.8946 0.48043 12 0.734784 12 1V4H10V2H2V14H10V12H12Z" fill="currentColor"/>
              <path d="M16 8L12 4V7H5V9H12V12L16 8Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
