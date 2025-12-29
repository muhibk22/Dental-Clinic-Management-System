interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
    size?: 'sm' | 'md';
}

const variantClasses = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
};

export default function Badge({
    children,
    variant = 'default',
    size = 'sm',
}: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center font-semibold rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}
        >
            {children}
        </span>
    );
}
