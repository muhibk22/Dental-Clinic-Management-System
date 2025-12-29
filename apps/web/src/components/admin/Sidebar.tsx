"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Stethoscope,
    UserCircle,
    Calendar,
    Clipboard,
    Pill,
    Receipt,
    FileText,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { logout } from '@/lib/api';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: 'Overview', href: '/dashboard/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Users', href: '/dashboard/admin/users', icon: <Users size={20} /> },
    { label: 'Doctors', href: '/dashboard/admin/doctors', icon: <Stethoscope size={20} /> },
    { label: 'Patients', href: '/dashboard/admin/patients', icon: <UserCircle size={20} /> },
    { label: 'Appointments', href: '/dashboard/admin/appointments', icon: <Calendar size={20} /> },
    { label: 'Treatments', href: '/dashboard/admin/treatments', icon: <Clipboard size={20} /> },
    { label: 'Medicines', href: '/dashboard/admin/medicines', icon: <Pill size={20} /> },
    { label: 'Billing', href: '/dashboard/admin/billing', icon: <Receipt size={20} /> },
    { label: 'Prescriptions', href: '/dashboard/admin/prescriptions', icon: <FileText size={20} /> },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        window.location.href = '/login/admin';
    };

    const isActive = (href: string) => {
        if (href === '/dashboard/admin') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className={`p-6 border-b border-slate-700/50 ${collapsed ? 'px-4' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center font-black text-white text-lg">
                        O
                    </div>
                    {!collapsed && (
                        <div>
                            <h1 className="font-black text-white text-lg tracking-tight">OraDent</h1>
                            <p className="text-xs text-slate-400">Admin Portal</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive(item.href)
                                ? 'bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-white border border-teal-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }
              ${collapsed ? 'justify-center px-3' : ''}
            `}
                    >
                        <span className={isActive(item.href) ? 'text-teal-400' : 'group-hover:text-teal-400 transition-colors'}>
                            {item.icon}
                        </span>
                        {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all
            ${collapsed ? 'justify-center px-3' : ''}
          `}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="font-medium text-sm">Logout</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-xl shadow-lg"
            >
                <Menu size={24} />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-slate-900 z-50 transform transition-transform duration-300 flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>
                <SidebarContent />
            </aside>

            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col bg-slate-900 h-screen sticky top-0 transition-all duration-300
          ${collapsed ? 'w-20' : 'w-72'}
        `}
            >
                <SidebarContent />

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-all shadow-lg"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </aside>
        </>
    );
}
