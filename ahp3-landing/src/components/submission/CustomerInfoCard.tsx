import React from 'react';

interface CustomerInfoCardProps {
  title: string;
  fields: {
    label: string;
    value: string;
  }[];
  onEdit?: () => void;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  title,
  fields,
  onEdit,
}) => {
  return (
    <div className="border border-[#D8D8D8] rounded-md bg-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#333333]">{title}</h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-[#007B87] text-sm font-medium hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-[#666666] text-sm mb-1">{field.label}</span>
            <span className="text-[#333333] font-medium">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerInfoCard;
