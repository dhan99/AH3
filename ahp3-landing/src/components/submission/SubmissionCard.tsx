import React from 'react';
import Image from 'next/image';

interface SubmissionCardProps {
  title: string;
  description: string;
  iconSrc: string;
  onClick: () => void;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  title,
  description,
  iconSrc,
  onClick,
}) => {
  return (
    <div
      className="p-6 border border-[#D8D8D8] rounded-md bg-white cursor-pointer transition-all duration-200 hover:border-[#007B87] hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-14 h-14 flex items-center justify-center bg-[#F0F8FA] rounded-md">
            <Image
              src={iconSrc}
              alt={title}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-[#333333] mb-2">{title}</h3>
          <p className="text-base text-[#666666]">{description}</p>
        </div>
        
        <div className="flex-shrink-0 ml-4">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M9 18L15 12L9 6" 
              stroke="#007B87" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
