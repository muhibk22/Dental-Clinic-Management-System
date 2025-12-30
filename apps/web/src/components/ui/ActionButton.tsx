"use client";

import { LucideIcon } from 'lucide-react';

type ActionVariant = 'edit' | 'delete' | 'print' | 'view' | 'default';

interface ActionButtonProps {
    icon: LucideIcon;
    onClick: (e: React.MouseEvent) => void;
    variant?: ActionVariant;
    title?: string;
    disabled?: boolean;
}

const variantClasses: Record<ActionVariant, string> = {
    edit: 'text-slate-400 hover:text-blue-600 hover:bg-blue-50',
    delete: 'text-slate-400 hover:text-red-600 hover:bg-red-50',
    print: 'text-slate-400 hover:text-teal-600 hover:bg-teal-50',
    view: 'text-slate-400 hover:text-purple-600 hover:bg-purple-50',
    default: 'text-slate-400 hover:text-slate-600 hover:bg-slate-50',
};

export default function ActionButton({
    icon: Icon,
    onClick,
    variant = 'default',
    title,
    disabled = false,
}: ActionButtonProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-lg transition-all ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
        >
            <Icon size={16} />
        </button>
    );
}
