"use client";

import { useEffect, useState } from 'react';
import { Users, Stethoscope, UserCircle, Calendar, Pill, Receipt } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import StatsCard from '@/components/admin/StatsCard';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/ui/Badge';
import { getPatients, getDoctors, getAppointments, getMedicines, getBillings } from '@/lib/api';

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  time: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
    medicines: 0,
    revenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      const [patientsRes, doctorsRes, appointmentsRes, medicinesRes, billingsRes] = await Promise.all([
        getPatients(),
        getDoctors(),
        getAppointments(),
        getMedicines(),
        getBillings(),
      ]);

      // Calculate stats
      const patientCount = patientsRes.data?.length || 0;
      const doctorCount = doctorsRes.data?.length || 0;
      const appointmentCount = appointmentsRes.data?.length || 0;
      const medicineCount = medicinesRes.data?.length || 0;
      const totalRevenue = billingsRes.data?.reduce((sum: number, b: { totalamount: number }) => sum + Number(b.totalamount), 0) || 0;

      setStats({
        users: doctorCount + 5, // Approximate user count
        doctors: doctorCount,
        patients: patientCount,
        appointments: appointmentCount,
        medicines: medicineCount,
        revenue: totalRevenue,
      });

      // Recent appointments for activity table
      if (appointmentsRes.data) {
        const recent = appointmentsRes.data.slice(0, 5).map((apt: { appointmentid: number; patient?: { name: string }; appointmenttime: string; status: string }) => ({
          id: apt.appointmentid,
          type: 'Appointment',
          description: `${apt.patient?.name || 'Patient'} scheduled`,
          time: new Date(apt.appointmenttime).toLocaleDateString(),
          status: apt.status || 'Scheduled',
        }));
        setRecentAppointments(recent);
      }

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  const activityColumns = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'time', label: 'Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (item: RecentActivity) => (
        <Badge variant={item.status === 'Completed' ? 'success' : item.status === 'Cancelled' ? 'danger' : 'info'}>
          {item.status}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening today."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          color="blue"
          loading={loading}
        />
        <StatsCard
          title="Doctors"
          value={stats.doctors}
          icon={Stethoscope}
          color="teal"
          loading={loading}
        />
        <StatsCard
          title="Patients"
          value={stats.patients}
          icon={UserCircle}
          color="purple"
          loading={loading}
        />
        <StatsCard
          title="Appointments"
          value={stats.appointments}
          icon={Calendar}
          color="orange"
          loading={loading}
        />
        <StatsCard
          title="Medicines"
          value={stats.medicines}
          icon={Pill}
          color="green"
          loading={loading}
        />
        <StatsCard
          title="Revenue"
          value={`Rs. ${stats.revenue.toLocaleString()}`}
          icon={Receipt}
          color="blue"
          loading={loading}
        />
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
        <DataTable
          columns={activityColumns}
          data={recentAppointments}
          loading={loading}
          searchable={false}
          emptyMessage="No recent activity"
          pageSize={5}
        />
      </div>
    </DashboardLayout>
  );
}