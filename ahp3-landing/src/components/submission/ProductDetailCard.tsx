import React from 'react';
import Image from 'next/image';

interface CoverageItem {
  label: string;
  value: string;
}

interface CoverageSection {
  sectionTitle?: string;
  items: CoverageItem[];
}

interface ProductDetailCardProps {
  title: string;
  description: string;
  iconSrc: string;
  isSelected: boolean;
  onSelect: () => void;
  costHighlight?: string;
  coverageSections?: CoverageSection[];
  additionalDetails?: React.ReactNode;
  showCoverageDetails?: boolean;
  className?: string;
}

const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  title,
  description,
  iconSrc,
  isSelected,
  onSelect,
  costHighlight,
  coverageSections = [],
  additionalDetails,
  showCoverageDetails = true,
  className = "",

}) => {
  return (
    <div onClick={onSelect} className="w-full">
      <div className="flex flex-col">
        <div className="flex items-start bg-[#F2FBFC] border border-[#007B87] border-2 shadow-[0px_1px_20px_4px_rgba(0,0,0,0.16)]">
          <div className="flex-shrink-0 ml-4 mr-4 my-auto">
            <div className="w-12 h-12 flex items-center justify-center bg-[#F2FBFC] rounded-md">
                <Image
                  src={iconSrc}
                  alt={title}
                  width={24}
                  height={24}
                  style={{ width: 'auto', height: 'auto' }}
                  className="object-contain"
                />
            </div>
          </div>
          
          <div className="flex-grow">
            <h3 className="text-base font-semibold text-[#333333] mt-4  mb-2">{title}</h3>
            <p className="text-sm text-[#666666] mb-4">{description}</p>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <div
              className={`
                w-6 h-6 rounded-sm flex items-center justify-center mr-4 mt-4
                ${isSelected ? 
                  'bg-[#007B87] border border-[#007B87] text-white' : 
                  'border border-[#757575] bg-white'
                }
              `}
            >
              {isSelected && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                  <rect width="24" height="24" rx="4" fill="#007B87"/>
                  <path d="M19.155 8.32305L10.155 17.323C10.0459 17.4327 9.91619 17.5197 9.7733 17.5789C9.6304 17.6381 9.47718 17.6684 9.3225 17.668C9.16883 17.6691 9.01653 17.6391 8.87476 17.5798C8.73298 17.5205 8.60466 17.4332 8.4975 17.323L4.845 13.7455C4.6252 13.5257 4.50172 13.2276 4.50172 12.9168C4.50172 12.606 4.6252 12.3078 4.845 12.088C5.0648 11.8682 5.36291 11.7448 5.67375 11.7448C5.98459 11.7448 6.2827 11.8682 6.5025 12.088L9.285 14.878L17.4975 6.66555C17.7173 6.44575 18.0154 6.32227 18.3262 6.32227C18.6371 6.32227 18.9352 6.44575 19.155 6.66555C19.3748 6.88534 19.4983 7.18345 19.4983 7.4943C19.4983 7.80514 19.3748 8.10325 19.155 8.32305Z" fill="white"/>
                </svg>
              )}
            </div>
          </div>
        </div>
        
        {costHighlight && (
          <div className="mt-4 py-2 px-4 bg-[#E6EEEF] rounded">
            <p className="text-base font-semibold text-[#333333]">{costHighlight}</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default ProductDetailCard;
