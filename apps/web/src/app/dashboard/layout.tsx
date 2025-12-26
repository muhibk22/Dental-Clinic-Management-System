"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, UserCircle, Calendar, 
  Stethoscope, Pill, CreditCard, Settings, LogOut 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Navigation logic based on the role in the URL path
  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20}/>, path: '/dashboard/admin', roles: ['admin'] },
    { name: 'My Records', icon: <UserCircle size={20}/>, path: '/dashboard/patient', roles: ['patient'] },
    { name: 'Treatments', icon: <Stethoscope size={20}/>, path: '/dashboard/doctor', roles: ['doctor'] },
    { name: 'Appointments', icon: <Calendar size={20}/>, path: '/dashboard/receptionist', roles: ['receptionist', 'admin'] },
    { name: 'Inventory', icon: <Pill size={20}/>, path: '/dashboard/pharmacist', roles: ['pharmacist'] },
    { name: 'Billing', icon: <CreditCard size={20}/>, path: '/dashboard/receptionist', roles: ['receptionist', 'admin'] },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-oradent-blue text-white flex flex-col fixed h-full">
        <div className="p-6 text-2xl font-black border-b border-blue-800">
          Ora<span className="text-oradent-teal">Dent</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.path}>
              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                pathname.includes(item.path) ? 'bg-oradent-teal text-white' : 'hover:bg-blue-800 text-blue-100'
              }`}>
                {item.icon}
                <span className="font-semibold text-sm">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <Link href="/" className="flex items-center gap-3 p-3 text-red-300 hover:bg-red-900/20 rounded-xl transition-all">
            <LogOut size={20}/>
            <span className="font-bold text-sm">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-grow p-8">
        {children}
      </main>
    </div>
  );
}