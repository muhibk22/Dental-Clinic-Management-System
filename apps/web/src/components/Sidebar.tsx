"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  ClipboardList, 
  Pill, 
  CreditCard, 
  LogOut 
} from 'lucide-react';

const navItems = [
  { name: 'Overview', icon: <LayoutDashboard size={20} />, href: '/dashboard/admin' },
  { name: 'My Records', icon: <Users size={20} />, href: '/dashboard/admin/records' },
  { name: 'Treatments', icon: <Stethoscope size={20} />, href: '/dashboard/admin/treatments' },
  { name: 'Appointments', icon: <ClipboardList size={20} />, href: '/dashboard/admin/appointments' },
  { name: 'Inventory', icon: <Pill size={20} />, href: '/dashboard/admin/inventory' },
  { name: 'Billing', icon: <CreditCard size={20} />, href: '/dashboard/admin/billing' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        <h1 className="text-2xl font-black text-[#1e3a8a] tracking-tighter uppercase">OraDent</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                isActive 
                  ? "bg-blue-50 text-[#1e3a8a]" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* FIXED LOGOUT BUTTON */}
      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={() => router.push('/login/admin')}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
        >
          <div className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs">N</div>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}