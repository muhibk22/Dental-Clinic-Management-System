"use client";

import { forwardRef } from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label: string;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
    ({ label, options, placeholder = 'Select...', error, required, className = '', ...props }, ref) => {
        return (
            <div className={className}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <select
                    ref={ref}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all
                        ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-slate-200 focus:border-teal-500'
                        }`}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        );
    }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
