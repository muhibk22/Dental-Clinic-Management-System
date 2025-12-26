import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'teal' | 'outline';
  fullWidth?: boolean;
}

export const Button = ({ children, variant = 'primary', fullWidth, className, ...props }: ButtonProps) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm";
  
  const variants = {
    primary: "bg-oradent-blue text-white hover:bg-blue-900",
    secondary: "bg-blue-100 text-oradent-blue hover:bg-blue-200",
    teal: "bg-oradent-teal text-white hover:bg-teal-600 shadow-teal-100",
    outline: "border-2 border-oradent-blue text-oradent-blue hover:bg-oradent-blue hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};