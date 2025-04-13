import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, isActive }) => {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-lg font-semibold relative ${
        isActive 
          ? 'text-[#007B87] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#00B3BC]' 
          : 'text-[#007B87] hover:text-[#333333]'
      }`}
    >
      {label}
    </Link>
  );
};

interface MainNavigationProps {
  activeTab?: string;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ activeTab = 'dashboard' }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', id: 'dashboard' },
    { href: '/dashboard/submissions', label: 'Submissions', id: 'submissions' },
    { href: '/dashboard/accounts', label: 'Accounts', id: 'accounts' },
    { href: '/dashboard/reporting', label: 'Reporting', id: 'reporting' },
    { href: '/dashboard/claims', label: 'Claims', id: 'claims' },
    { href: '/dashboard/billing', label: 'Billing', id: 'billing' },
    { href: '/dashboard/support', label: 'Support', id: 'support' },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="w-full px-6">
        <div className="flex overflow-x-auto gap-8">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              href={item.href}
              label={item.label}
              isActive={activeTab === item.id || pathname === item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;
