import React from 'react';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg border border-[#F0F0F0] shadow-md hover:shadow-lg transition-all p-4 flex flex-col items-center justify-center gap-3"
    >
      <div className="text-[#007B87] text-2xl">
        {icon}
      </div>
      <span className="text-[#007B87] font-bold text-sm text-center">{label}</span>
    </button>
  );
};

export default ActionButton;
