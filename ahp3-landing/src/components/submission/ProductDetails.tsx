import React from 'react';

interface Benefit {
  label: string;
  value: string;
}

interface ProductDetailsProps {
  title: string;
  benefits: Benefit[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ title, benefits }) => {
  return (
    <div className="mt-2 p-4 bg-[#F9F8FB] border border-[#E6EEEF] rounded-md">
      <h4 className="text-md font-semibold text-[#333333] mb-2">Benefits Summary</h4>
      
      <div className="space-y-2">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-[#666666]">{benefit.label}</span>
            <span className="font-medium text-[#333333]">{benefit.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
