import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Button({ children, variant = 'outline', onClick, className, disabled }: ButtonProps) {
  const buttonClassName = className || '';
  const buttonVariant = variant === 'default' 
    ? 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' 
    : 'border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button 
      onClick={onClick} 
      className={`${buttonVariant} ${buttonClassName} ${disabledClass}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
