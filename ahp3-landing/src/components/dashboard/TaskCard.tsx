import React from 'react';

export interface TaskCardProps {
  company: string;
  taskType: string;
  description: string;
  dueDate: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  company,
  taskType,
  description,
  dueDate,
  isSelected = false,
  onClick,
}) => {
  return (
    <div 
      className={`w-full p-4 rounded-md cursor-pointer transition-colors ${
        isSelected ? 'bg-[#F9F8FB]' : 'bg-white hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="space-y-1">
        <h4 className={`text-sm font-normal ${isSelected ? 'text-[#007B87]' : 'text-[#333333]'}`}>
          {company}
        </h4>
        <div className="flex flex-col mb-2">
          <span className="text-sm font-semibold text-[#333333]">{taskType}</span>
        </div>
        <div className="flex justify-between">
          <p className="text-xs text-[#333333]">{description}</p>
          <p className="text-xs text-[#757575]">{dueDate}</p>
        </div>
        
        {isSelected && (
          <div className="text-right mt-4">
            <button className="text-xs text-[#007B87] font-semibold">
              Clear task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
