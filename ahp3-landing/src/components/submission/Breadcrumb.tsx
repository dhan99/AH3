import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="bg-white border-b border-[#E6EEEF] p-4">
      <nav className="container mx-auto">
        <ol className="flex flex-wrap list-none p-0 m-0">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-[#999999]">/</span>
              )}
              
              {item.active ? (
                <span className="text-[#007B87] font-medium">{item.label}</span>
              ) : (
                item.href ? (
                  <Link href={item.href} className="text-[#666666] hover:text-[#007B87] hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#666666]">{item.label}</span>
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
