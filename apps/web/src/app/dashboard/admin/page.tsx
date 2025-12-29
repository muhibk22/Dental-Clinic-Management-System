"use client";

import { useEffect, useState } from 'react';
import { Users, Stethoscope, UserCircle, Calendar, Pill, Receipt, TrendingUp, Clock, Activity } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Badge from '@/components/ui/Badge';
import { getPatients, getDoctors, getAppointments, getMedicines, getBillings, getUsers } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
    todayAppointments: 0,
    medicines: 0,
    lowStockMedicines: 0,
    revenue: 0,
    pendingPayments: 0,
  });
  interface AppointmentData {
    appointmentid: number;
    patient?: { name: string };
    doctor?: { name: string };
    appointmenttime: string;
    status: string;
  }
  const [recentAppointments, setRecentAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      const [usersRes, patientsRes, doctorsRes, appointmentsRes, medicinesRes, billingsRes] = await Promise.all([
        getUsers(),
        getPatients(),
        getDoctors(),
        getAppointments(),
        getMedicines(),
        getBillings(),
      ]);

      // Calculate stats
      const userCount = usersRes.data?.length || 0;
      const patientCount = patientsRes.data?.length || 0;
      const doctorCount = doctorsRes.data?.length || 0;
      const appointmentCount = appointmentsRes.data?.length || 0;
      const medicineCount = medicinesRes.data?.length || 0;

      // Today's appointments
      const today = new Date().toDateString();
      const todayAppointments = appointmentsRes.data?.filter((a: { appointmenttime: string }) =>
        new Date(a.appointmenttime).toDateString() === today
      ).length || 0;

      // Low stock medicines
      const lowStock = medicinesRes.data?.filter((m: { quantity: number }) => m.quantity <= 10).length || 0;

      // Revenue calculations
      const totalRevenue = billingsRes.data?.filter((b: { paymentstatus?: string }) =>
        b.paymentstatus === 'Paid' || b.paymentstatus === 'PAID'
      ).reduce((sum: number, b: { totalamount: number }) => sum + Number(b.totalamount), 0) || 0;

      const pendingPayments = billingsRes.data?.filter((b: { paymentstatus?: string }) =>
        b.paymentstatus === 'Pending' || b.paymentstatus === 'PENDING'
      ).reduce((sum: number, b: { totalamount: number }) => sum + Number(b.totalamount), 0) || 0;

      setStats({
        users: userCount,
        doctors: doctorCount,
        patients: patientCount,
        appointments: appointmentCount,
        todayAppointments,
        medicines: medicineCount,
        lowStockMedicines: lowStock,
        revenue: totalRevenue,
        pendingPayments,
      });

      // Recent appointments
      if (appointmentsRes.data) {
        setRecentAppointments(appointmentsRes.data.slice(0, 5));
      }

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  const StatCard = ({
    title, value, subtitle, icon: Icon, gradient, loading: isLoading
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    gradient: string;
    loading?: boolean;
  }) => (
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
        {isLoading ? (
          <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-lg" />
        ) : (
          <p className="text-2xl font-black text-slate-900">{value}</p>
        )}
      </div>
    </div>
  );

  const BigStatCard = ({
    title, value, subtitle, icon: Icon, gradient, trend, loading: isLoading
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    gradient: string;
    trend?: string;
    loading?: boolean;
  }) => (
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
        {isLoading ? (
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

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your clinic overview."
    >
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <BigStatCard
          title="Total Revenue"
          value={`Rs. ${stats.revenue.toLocaleString()}`}
          subtitle={`Rs. ${stats.pendingPayments.toLocaleString()} pending`}
          icon={Receipt}
          gradient="from-emerald-500 to-teal-600"
          loading={loading}
        />
        <BigStatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          subtitle={`${stats.appointments} total appointments`}
          icon={Calendar}
          gradient="from-blue-500 to-indigo-600"
          loading={loading}
        />
        <BigStatCard
          title="Active Patients"
          value={stats.patients}
          subtitle="Registered patients"
          icon={UserCircle}
          gradient="from-purple-500 to-pink-600"
          loading={loading}
        />
        <BigStatCard
          title="Staff Members"
          value={stats.users}
          subtitle={`${stats.doctors} doctors`}
          icon={Users}
          gradient="from-amber-500 to-orange-600"
          loading={loading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Doctors"
          value={stats.doctors}
          icon={Stethoscope}
          gradient="from-teal-400 to-teal-600"
          loading={loading}
        />
        <StatCard
          title="Patients"
          value={stats.patients}
          icon={UserCircle}
          gradient="from-purple-400 to-purple-600"
          loading={loading}
        />
        <StatCard
          title="Medicines"
          value={stats.medicines}
          subtitle={stats.lowStockMedicines > 0 ? `${stats.lowStockMedicines} low` : undefined}
          icon={Pill}
          gradient="from-green-400 to-green-600"
          loading={loading}
        />
        <StatCard
          title="Appointments"
          value={stats.appointments}
          icon={Calendar}
          gradient="from-blue-400 to-blue-600"
          loading={loading}
        />
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Appointments</h2>
              <p className="text-sm text-slate-500">Latest patient activities</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))
          ) : recentAppointments.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              <Calendar className="mx-auto mb-3 text-slate-300" size={40} />
              <p>No appointments yet</p>
            </div>
          ) : (
            recentAppointments.map((apt) => (
              <div key={apt.appointmentid} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {(apt.patient?.name || 'P')[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{apt.patient?.name || 'Patient'}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock size={12} />
                      <span>{new Date(apt.appointmenttime).toLocaleDateString()}</span>
                      <span className="text-slate-300">•</span>
                      <span>Dr. {apt.doctor?.name || 'Doctor'}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={
                  apt.status === 'Completed' || apt.status === 'COMPLETED' ? 'success' :
                    apt.status === 'Cancelled' || apt.status === 'CANCELLED' ? 'danger' :
                      'info'
                }>
                  {apt.status || 'Scheduled'}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}