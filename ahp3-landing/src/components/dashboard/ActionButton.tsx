'use client';

import React, { useState } from 'react';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    // Simulate a short press effect
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
      onClick();
    }, 150);
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        w-full bg-white rounded-lg border border-[#F0F0F0] 
        p-4 flex flex-col items-center justify-center gap-3
        transition-all duration-200 ease-in-out
        ${isPressed 
          ? 'shadow-inner scale-95 bg-[#F2FBFC] transform translate-y-0.5'
          : 'shadow-md hover:shadow-lg hover:scale-105 hover:bg-[#F9FDFD]'
        }
      `}
    >
      <div className={`text-[#007B87] text-3xl transition-transform duration-200 ${isPressed ? 'scale-95' : ''}`}>
        {icon}
      </div>
      <span className={`text-[#007B87] font-bold text-lg text-center transition-all duration-200 ${isPressed ? 'opacity-90' : ''}`}>
        {label}
      </span>
    </button>
  );
};

export default ActionButton;
