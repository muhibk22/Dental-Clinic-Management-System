"use client";
import React, { useState } from 'react';
import { Stethoscope, UserPlus, Pill, ClipboardList, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. Arshad', role: 'Doctor', email: 'arshad@oradent.com', bio: 'Expert in Orthodontics' },
    { id: 2, name: 'Zahid Khan', role: 'Patient', email: 'zahid@gmail.com', bio: 'N/A' },
  ]);

  const addUser = (role: string) => {
    const name = prompt(`Enter ${role} Name:`);
    if (name) {
      setUsers([{ id: Date.now(), name, role, email: `${name.toLowerCase()}@oradent.com`, bio: 'New User' }, ...users]);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-[#1e3a8a] tracking-tighter">System Admin</h1>
          <p className="text-slate-500 font-medium mt-2">Manage Personnel & Credentials</p>
        </div>

        {/* PROPERLY STYLED BUTTONS */}
        <div className="flex items-center gap-3">
          {/* Doctor Button - Solid Blue */}
          <Button
            onClick={() => addUser('Doctor')}
            className="bg-[#1e3a8a] text-white font-bold px-7 py-2.5 rounded-2xl shadow-lg hover:bg-blue-800 transition-all flex items-center gap-2"
          >
            <Stethoscope size={18} /> + Doctor
          </Button>

          {/* Patient Button - Solid Teal/Green */}
          <Button
            onClick={() => addUser('Patient')}
            className="bg-[#14b8a6] text-white font-bold px-7 py-2.5 rounded-2xl shadow-lg hover:bg-teal-700 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} /> + Patient
          </Button>

          {/* Pharma Button - Solid Dark Slate */}
          <Button
            onClick={() => addUser('Pharmacist')}
            className="bg-[#0f172a] text-white font-bold px-7 py-2.5 rounded-2xl shadow-lg hover:bg-black transition-all flex items-center gap-2"
          >
            <Pill size={18} /> + Pharma
          </Button>

          {/* Recp Button - Solid Blue (Matches your screenshot) */}
          <Button
            onClick={() => addUser('Receptionist')}
            className="bg-[#1e3a8a] text-white font-bold px-7 py-2.5 rounded-2xl shadow-lg hover:bg-blue-800 transition-all flex items-center gap-2"
          >
            <ClipboardList size={18} /> + Recp
          </Button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-8 text-[11px] font-black uppercase tracking-widest text-slate-400">User Details</th>
              <th className="p-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Bio / Info</th>
              <th className="p-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Role</th>
              <th className="p-8 text-right text-[11px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-8">
                  <p className="font-bold text-[#1e3a8a] text-lg">{user.name}</p>
                  <p className="text-sm text-slate-400 font-medium">{user.email}</p>
                </td>
                <td className="p-8 text-slate-500 italic font-medium">{user.bio}</td>
                <td className="p-8">
                  <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-600 tracking-wider">
                    {user.role}
                  </span>
                </td>
                <td className="p-8 text-right">
                  <button className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}