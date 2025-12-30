"use client";

import { useEffect, useState } from 'react';
import { Users, Stethoscope, UserCircle, Calendar, Pill, Receipt, Clock, Activity } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import StatCard from '@/components/admin/StatCard';
import BigStatCard from '@/components/admin/BigStatCard';
import Badge from '@/components/ui/Badge';
import { getPatients, getDoctors, getAppointments, getMedicines, getBillings, getUsers } from '@/lib/api';
import { gradients } from '@/lib/constants';

interface AppointmentData {
    appointmentid: number;
    patient?: { name: string };
    doctor?: { name: string };
    appointmenttime: string;
    status: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0, doctors: 0, patients: 0, appointments: 0,
        todayAppointments: 0, medicines: 0, lowStockMedicines: 0,
        revenue: 0, pendingPayments: 0,
    });
    const [recentAppointments, setRecentAppointments] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);
            const [usersRes, patientsRes, doctorsRes, appointmentsRes, medicinesRes, billingsRes] = await Promise.all([
                getUsers(), getPatients(), getDoctors(), getAppointments(), getMedicines(), getBillings(),
            ]);

            const today = new Date().toDateString();
            const todayAppointments = appointmentsRes.data?.filter((a: { appointmenttime: string }) =>
                new Date(a.appointmenttime).toDateString() === today
            ).length || 0;

            const lowStock = medicinesRes.data?.filter((m: { quantity: number }) => m.quantity <= 10).length || 0;
            const totalRevenue = billingsRes.data?.filter((b: { paymentstatus?: string }) =>
                b.paymentstatus === 'Paid' || b.paymentstatus === 'PAID'
            ).reduce((sum: number, b: { totalamount: number }) => sum + Number(b.totalamount), 0) || 0;
            const pendingPayments = billingsRes.data?.filter((b: { paymentstatus?: string }) =>
                b.paymentstatus === 'Pending' || b.paymentstatus === 'PENDING'
            ).reduce((sum: number, b: { totalamount: number }) => sum + Number(b.totalamount), 0) || 0;

            setStats({
                users: usersRes.data?.length || 0, doctors: doctorsRes.data?.length || 0,
                patients: patientsRes.data?.length || 0, appointments: appointmentsRes.data?.length || 0,
                todayAppointments, medicines: medicinesRes.data?.length || 0, lowStockMedicines: lowStock,
                revenue: totalRevenue, pendingPayments,
            });
            if (appointmentsRes.data) setRecentAppointments(appointmentsRes.data.slice(0, 5));
            setLoading(false);
        }
        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's your clinic overview.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <BigStatCard title="Total Revenue" value={`Rs. ${stats.revenue.toLocaleString()}`} subtitle={`Rs. ${stats.pendingPayments.toLocaleString()} pending`} icon={Receipt} gradient={gradients.emerald} loading={loading} />
                <BigStatCard title="Today's Appointments" value={stats.todayAppointments} subtitle={`${stats.appointments} total`} icon={Calendar} gradient={gradients.blue} loading={loading} />
                <BigStatCard title="Active Patients" value={stats.patients} subtitle="Registered patients" icon={UserCircle} gradient={gradients.purple} loading={loading} />
                <BigStatCard title="Staff Members" value={stats.users} subtitle={`${stats.doctors} doctors`} icon={Users} gradient={gradients.amber} loading={loading} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <StatCard title="Doctors" value={stats.doctors} icon={Stethoscope} gradient={gradients.teal} loading={loading} />
                <StatCard title="Patients" value={stats.patients} icon={UserCircle} gradient={gradients.purple} loading={loading} />
                <StatCard title="Medicines" value={stats.medicines} subtitle={stats.lowStockMedicines > 0 ? `${stats.lowStockMedicines} low` : undefined} icon={Pill} gradient={gradients.green} loading={loading} />
                <StatCard title="Appointments" value={stats.appointments} icon={Calendar} gradient={gradients.blue} loading={loading} />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center"><Activity size={18} className="text-white" /></div>
                    <div><h2 className="text-lg font-bold text-slate-900">Recent Appointments</h2><p className="text-sm text-slate-500">Latest patient activities</p></div>
                </div>
                <div className="divide-y divide-slate-100">
                    {loading ? [...Array(5)].map((_, i) => (
                        <div key={i} className="px-6 py-4 flex items-center gap-4"><div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" /><div className="flex-1"><div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2" /><div className="h-3 w-24 bg-slate-100 rounded animate-pulse" /></div></div>
                    )) : recentAppointments.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500"><Calendar className="mx-auto mb-3 text-slate-300" size={40} /><p>No appointments yet</p></div>
                    ) : recentAppointments.map((apt) => (
                        <div key={apt.appointmentid} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">{(apt.patient?.name || 'P')[0]}</div>
                                <div><p className="font-semibold text-slate-900">{apt.patient?.name || 'Patient'}</p><div className="flex items-center gap-2 text-sm text-slate-500"><Clock size={12} /><span>{new Date(apt.appointmenttime).toLocaleDateString()}</span><span className="text-slate-300">•</span><span>Dr. {apt.doctor?.name || 'Doctor'}</span></div></div>
                            </div>
                            <Badge variant={apt.status === 'Completed' ? 'success' : apt.status === 'Cancelled' ? 'danger' : 'info'}>{apt.status || 'Scheduled'}</Badge>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
