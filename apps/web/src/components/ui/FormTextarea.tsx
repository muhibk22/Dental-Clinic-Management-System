"use client";

import { forwardRef } from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ label, error, required, className = '', rows = 3, ...props }, ref) => {
        return (
            <div className={className}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                    ref={ref}
                    rows={rows}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none transition-all
                        ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-slate-200 focus:border-teal-500'
                        }`}
                    {...props}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        );
    }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
