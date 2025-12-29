"use client";

import { useState } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    pageSize?: number;
}

export default function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    loading = false,
    searchable = true,
    searchPlaceholder = 'Search...',
    onRowClick,
    emptyMessage = 'No data found',
    pageSize = 10,
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data based on search
    const filteredData = data.filter((item) =>
        columns.some((col) => {
            const value = item[col.key as keyof T];
            return String(value ?? '').toLowerCase().includes(search.toLowerCase());
        })
    );

    // Sort data
    const sortedData = sortKey
        ? [...filteredData].sort((a, b) => {
            const aVal = a[sortKey as keyof T];
            const bVal = b[sortKey as keyof T];
            const comparison = String(aVal ?? '').localeCompare(String(bVal ?? ''));
            return sortDirection === 'asc' ? comparison : -comparison;
        })
        : filteredData;

    // Paginate
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Search Bar */}
            {searchable && (
                <div className="p-4 border-b border-slate-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                    className={`px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider
                    ${col.sortable ? 'cursor-pointer hover:text-slate-700 select-none' : ''}
                    ${col.className || ''}
                  `}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        {col.sortable && sortKey === col.key && (
                                            sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {columns.map((col, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-slate-200 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => onRowClick?.(item)}
                                    className={`hover:bg-slate-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className={`px-6 py-4 text-sm ${col.className || ''}`}>
                                            {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm text-slate-600 px-3">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
