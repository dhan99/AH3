import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
  isIcon?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="bg-white border-b-0 border-[#E6EEEF] p-4">
      <nav className="pl">
        <ol className="flex flex-wrap list-none p-0 m-0">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-[#999999]">/</span>
              )}
              
              {item.isIcon ? (
                item.href ? (
                  <Link href={item.href} className="text-[#666666] hover:text-[#007B87]">
                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_40000097_14098)">
                    <path d="M15.9944 7.48589C15.9944 7.98589 15.5778 8.37756 15.1056 8.37756H14.2167L14.2361 12.8276C14.2417 13.8137 13.4444 14.6137 12.4583 14.6137H3.55833C2.57778 14.6137 1.78056 13.8165 1.78056 12.8359V8.37756H0.888889C0.388889 8.37756 0 7.98867 0 7.48589C0 7.23589 0.0833333 7.01367 0.277778 6.81923L7.4 0.610894C7.59444 0.41645 7.81667 0.388672 8.01111 0.388672C8.20555 0.388672 8.42778 0.444227 8.59444 0.583116L15.6889 6.81923C15.9111 7.01367 16.0222 7.23589 15.9944 7.48589Z" fill="#007B87"/>
</g>
                    <defs>
                      <clipPath id="clip0_40000097_14098">
                        <rect width="16" height="14.2222" fill="white" transform="translate(0 0.388672)"/>
                      </clipPath>
                    </defs>
                    </svg>
                  </Link>
                ) : (
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M8 1.33337L1.33334 6.66671V14H5.33334V9.33337H10.6667V14H14.6667V6.66671L8 1.33337Z" 
                      stroke="#666666" 
                      strokeWidth="1.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                )
              ) : (
                item.active ? (
                  <span className="text-[#007B87] font-medium">{item.label}</span>
                ) : (
                  item.href ? (
                    <Link href={item.href} className="text-[#666666] hover:text-[#007B87] hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[#666666]">{item.label}</span>
                  )
                )
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
