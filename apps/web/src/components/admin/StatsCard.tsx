import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'teal' | 'purple' | 'orange' | 'red' | 'green';
    loading?: boolean;
}

const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    teal: 'from-teal-500 to-teal-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
};

const iconBgClasses = {
    blue: 'bg-blue-500/10 text-blue-600',
    teal: 'bg-teal-500/10 text-teal-600',
    purple: 'bg-purple-500/10 text-purple-600',
    orange: 'bg-orange-500/10 text-orange-600',
    red: 'bg-red-500/10 text-red-600',
    green: 'bg-green-500/10 text-green-600',
};

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    color = 'blue',
    loading = false,
}: StatsCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        {title}
                    </p>
                    {loading ? (
                        <div className="h-9 w-24 bg-slate-200 rounded-lg animate-pulse mt-2" />
                    ) : (
                        <p className="text-3xl font-black text-slate-900 mt-2">
                            {value}
                        </p>
                    )}
                    {trend && !loading && (
                        <p className={`text-sm mt-2 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}
