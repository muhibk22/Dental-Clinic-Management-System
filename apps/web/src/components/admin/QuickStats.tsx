"use client";

interface QuickStatProps {
    label: string;
    value: string | number;
    color?: 'default' | 'green' | 'red' | 'yellow' | 'purple';
}

const colorClasses = {
    default: 'text-slate-900',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
};

export function QuickStat({ label, value, color = 'default' }: QuickStatProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
        </div>
    );
}

interface QuickStatsGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
}

export function QuickStatsGrid({ children, columns = 3 }: QuickStatsGridProps) {
    const colClasses = {
        2: 'sm:grid-cols-2',
        3: 'sm:grid-cols-3',
        4: 'sm:grid-cols-4',
    };

    return (
        <div className={`grid grid-cols-1 ${colClasses[columns]} gap-4 mb-6`}>
            {children}
        </div>
    );
}
