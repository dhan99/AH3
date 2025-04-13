import React from 'react';
import Link from 'next/link';

export interface ActivityCardProps {
  companyName: string;
  status: string;
  dotNumber?: string;
  mcNumber?: string;
  units?: number;
  drivers?: number;
  city?: string;
  state?: string;
  effectiveDate?: string;
  products: {
    occupationalAccident?: boolean;
    nonTruckingLiability?: boolean;
    vehiclePhysicalDamage?: boolean;
  };
  onEdit?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  companyName,
  status,
  dotNumber,
  mcNumber,
  units,
  drivers,
  city,
  state,
  effectiveDate,
  products,
  onEdit,
}) => {
  const statusColors: Record<string, string> = {
    'Drafted': 'bg-[#F0F0F0] text-[#333333]',
    'Quote Created': 'bg-[#F0F0F0] text-[#333333]',
    'Proposal Sent': 'bg-[#F0F0F0] text-[#333333]',
    'Quote Expiring': 'bg-[#F0F0F0] text-[#333333]',
    'Bound': 'bg-[#F0F0F0] text-[#333333]',
  };

  const statusColor = statusColors[status] || 'bg-[#F0F0F0] text-[#333333]';

  return (
    <div className="w-full rounded-lg border border-[#E6EEEF] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#E7F2EC] to-[#D3E3E5]">
        <h3 className="text-[#007B87] font-semibold text-lg">{companyName}</h3>
        <div className="px-2 py-1 rounded-full text-medium font-semibold inline-flex items-center justify-center" style={{minWidth: '80px'}}>
          <span className={`${statusColor} px-2 py-1 rounded-full text-sm font-semibold`}>
            {status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-4 gap-4 text-sm text-[#333333]">
          <div className="space-y-2">
            <p>DOT Number</p>
            <p># units</p>
            <p>City</p>
            <p>Occupational Accident</p>
          </div>
          <div className="space-y-2">
            <p>{dotNumber || '—'}</p>
            <p>{units !== undefined ? units : '—'}</p>
            <p>{city || '—'}</p>
            <p>{products.occupationalAccident ? 'Yes' : 'No'}</p>
          </div>
          <div className="space-y-2">
            <p>MC Number</p>
            <p># drivers</p>
            <p>State</p>
            <p>Non-Trucking Liability</p>
          </div>
          <div className="space-y-2">
            <p>{mcNumber || '—'}</p>
            <p>{drivers !== undefined ? drivers : '—'}</p>
            <p>{state || '—'}</p>
            <p>{products.nonTruckingLiability ? 'Yes' : 'No'}</p>
          </div>
          <div className="space-y-2">
            <p>Effective Date</p>
            <p></p>
            <p></p>
            <p>Vehicle Physical Damage</p>
          </div>
          <div className="space-y-2">
            <p>{effectiveDate || '—'}</p>
            <p></p>
            <p></p>
            <p>{products.vehiclePhysicalDamage ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Edit Link */}
        <div className="mt-4 text-right">
          <button
            onClick={onEdit}
            className="text-[#007B87] font-semibold text-sm hover:underline"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
