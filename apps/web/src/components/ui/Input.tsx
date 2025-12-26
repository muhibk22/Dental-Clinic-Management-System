import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{label}</label>}
      <input 
        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-oradent-teal focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 ${className}`}
        {...props}
      />
    </div>
  );
};