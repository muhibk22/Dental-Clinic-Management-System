"use client";

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    gradient: string;
    loading?: boolean;
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    gradient,
    loading = false,
}: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} className="text-white" />
                </div>
                {subtitle && (
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                        {subtitle}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                {loading ? (
                    <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-lg" />
                ) : (
                    <p className="text-2xl font-black text-slate-900">{value}</p>
                )}
            </div>
        </div>
    );
}
