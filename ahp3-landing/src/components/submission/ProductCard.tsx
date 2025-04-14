import React from 'react';
import Image from 'next/image';

interface ProductCardProps {
  title: string;
  description: string;
  iconSrc: string;
  isSelected: boolean;
  onSelect: () => void;
  costHighlight?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  iconSrc,
  isSelected,
  onSelect,
  costHighlight,
}) => {
  return (
    <div onClick={onSelect} className="w-full">
      <div className="flex flex-col">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4 my-auto">
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
            <h3 className="text-base font-semibold text-[#333333] mb-2">{title}</h3>
            <p className="text-sm text-[#666666]">{description}</p>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <div
              className={`
                w-5 h-5 rounded-sm flex items-center justify-center
                ${isSelected ? 
                  'bg-[#007B87] border border-[#007B87] text-white' : 
                  'border border-[#757575] bg-white'
                }
              `}
            >
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
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

export default ProductCard;
