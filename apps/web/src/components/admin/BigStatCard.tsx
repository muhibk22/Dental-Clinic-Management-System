"use client";

import { LucideIcon, TrendingUp } from 'lucide-react';

interface BigStatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    gradient: string;
    trend?: string;
    loading?: boolean;
}

export default function BigStatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    gradient,
    trend,
    loading = false,
}: BigStatCardProps) {
    return (
        <div className={`rounded-2xl p-6 bg-gradient-to-br ${gradient} text-white relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Icon size={20} />
                    </div>
                    <span className="text-sm font-medium text-white/80">{title}</span>
                </div>
                {loading ? (
                    <div className="h-10 w-32 bg-white/20 animate-pulse rounded-lg" />
                ) : (
                    <p className="text-3xl font-black mb-1">{value}</p>
                )}
                {subtitle && (
                    <p className="text-sm text-white/70">{subtitle}</p>
                )}
                {trend && (
                    <div className="flex items-center gap-1 mt-3 text-sm">
                        <TrendingUp size={14} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
