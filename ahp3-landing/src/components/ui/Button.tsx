'use client';

import React, { useState, ButtonHTMLAttributes } from 'react';

// Variant types for the button
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconLeft,
  iconRight,
  children,
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // Base styles that apply to all buttons
  const baseStyles = 'font-semibold rounded focus:outline-none transition-all duration-200 ease-in-out flex items-center justify-center';
  
  // Size-specific styles
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant-specific styles
  const variantStyles = {
    primary: `bg-[#007B87] text-white ${
      isPressed 
        ? 'shadow-inner scale-95 bg-[#006670] transform translate-y-0.5' 
        : 'shadow-md hover:shadow-lg hover:bg-[#008b99]'
    }`,
    secondary: `bg-[#5A6B8C] text-white ${
      isPressed 
        ? 'shadow-inner scale-95 bg-[#4a5b7c] transform translate-y-0.5' 
        : 'shadow-md hover:shadow-lg hover:bg-[#6a7b9c]'
    }`,
    outline: `bg-transparent border-2 border-[#007B87] text-[#007B87] ${
      isPressed 
        ? 'shadow-inner scale-95 bg-[#F2FBFC] transform translate-y-0.5' 
        : 'hover:bg-[#F9FDFD] hover:shadow'
    }`,
    text: `bg-transparent text-[#007B87] ${
      isPressed 
        ? 'scale-95 transform translate-y-0.5 opacity-80' 
        : 'hover:underline'
    }`,
  };

  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';

  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`;

  return (
    <button
      className={buttonStyles}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {iconLeft && (
        <span className={`mr-2 ${isPressed ? 'scale-95' : ''} transition-transform duration-200`}>
          {iconLeft}
        </span>
      )}
      <span className={`${isPressed ? 'opacity-90' : ''} transition-all duration-200`}>
        {children}
      </span>
      {iconRight && (
        <span className={`ml-2 ${isPressed ? 'scale-95' : ''} transition-transform duration-200`}>
          {iconRight}
        </span>
      )}
    </button>
  );
};

export default Button;
