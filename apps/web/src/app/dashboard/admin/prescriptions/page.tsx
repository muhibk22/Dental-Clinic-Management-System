"use client";

import { useEffect, useState } from 'react';
import { Plus, FileText, Calendar, Pill } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPrescriptions, Prescription } from '@/lib/api';

export default function PrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const result = await getPrescriptions();
        if (result.data) setPrescriptions(result.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            key: 'prescriptionid',
            label: 'Prescription #',
            sortable: true,
            render: (p: Prescription) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FileText size={18} className="text-purple-600" />
                    </div>
                    <span className="font-semibold text-slate-900">RX-{String(p.prescriptionid).padStart(4, '0')}</span>
                </div>
            ),
        },
        {
            key: 'appointmentid',
            label: 'Appointment',
            render: (p: Prescription) => (
                <span className="text-slate-600">Appointment #{p.appointmentid}</span>
            ),
        },
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (p: Prescription) => (
                <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={16} />
                    {new Date(p.date).toLocaleDateString()}
                </div>
            ),
        },
        {
            key: 'notes',
            label: 'Notes',
            render: (p: Prescription) => (
                <span className="text-sm text-slate-500 truncate max-w-[250px] block">
                    {p.notes || 'No notes'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: () => (
                <Badge variant="success">Issued</Badge>
            ),
        },
    ];

    return (
        <DashboardLayout
            title="Prescriptions"
            subtitle="View and manage patient prescriptions"
            actions={
                <Button className="flex items-center gap-2">
                    <Plus size={18} /> New Prescription
                </Button>
            }
        >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Total Prescriptions</p>
                    <p className="text-2xl font-bold text-slate-900">{prescriptions.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">This Month</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {prescriptions.filter(p => {
                            const pDate = new Date(p.date);
                            const now = new Date();
                            return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
                        }).length}
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={prescriptions}
                loading={loading}
                searchPlaceholder="Search prescriptions..."
                emptyMessage="No prescriptions found"
            />
        </DashboardLayout>
    );
}
