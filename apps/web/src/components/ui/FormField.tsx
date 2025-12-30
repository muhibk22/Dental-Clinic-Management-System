"use client";

import { forwardRef } from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    hint?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, error, hint, required, className = '', ...props }, ref) => {
        return (
            <div className={className}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    ref={ref}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all
                        ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-slate-200 focus:border-teal-500'
                        }`}
                    {...props}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                {hint && !error && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
            </div>
        );
    }
);

FormField.displayName = 'FormField';

export default FormField;
