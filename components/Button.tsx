import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "font-bold py-3 px-6 rounded-2xl text-lg uppercase tracking-wider select-none focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed btn-3d";
  
  const variants = {
    primary: "bg-[#58cc02] text-white shadow-[#58a700] hover:bg-[#46a302] disabled:shadow-none disabled:transform-none",
    secondary: "bg-[#1cb0f6] text-white shadow-[#1899d6] hover:bg-[#169ad0] disabled:shadow-none disabled:transform-none",
    danger: "bg-[#ff4b4b] text-white shadow-[#d43f3f] hover:bg-[#d43f3f] disabled:shadow-none disabled:transform-none",
    outline: "bg-white text-[#afafaf] border-2 border-[#e5e5e5] shadow-[#e5e5e5] hover:bg-gray-50 active:border-[#58cc02] active:text-[#58cc02] active:shadow-none",
    ghost: "bg-transparent text-[#1cb0f6] hover:bg-blue-50 shadow-none btn-3d-none active:transform-none"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
