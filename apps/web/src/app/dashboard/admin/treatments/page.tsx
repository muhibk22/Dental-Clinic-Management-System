"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Activity, User } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getTreatments, getPatients, createTreatment, Treatment, Patient } from '@/lib/api';

export default function TreatmentsPage() {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientid: '',
        name: '',
        description: '',
        status: 'Active',
    });

    const fetchData = async () => {
        setLoading(true);
        const [treatRes, patRes] = await Promise.all([
            getTreatments(),
            getPatients(),
        ]);
        if (treatRes.data) setTreatments(treatRes.data);
        if (patRes.data) setPatients(patRes.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddTreatment = () => {
        setFormData({ patientid: '', name: '', description: '', status: 'Active' });
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        await createTreatment({
            patientid: Number(formData.patientid),
            name: formData.name,
            description: formData.description,
            status: formData.status,
        });
        setModalOpen(false);
        fetchData();
    };

    const getPatientName = (patientid: number) => {
        const patient = patients.find(p => p.patientid === patientid);
        return patient?.name || `Patient #${patientid}`;
    };

    const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
        Active: 'info',
        Completed: 'success',
        Cancelled: 'danger',
    };

    const columns = [
        {
            key: 'name',
            label: 'Treatment',
            sortable: true,
            render: (t: Treatment) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Activity size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{t.name}</p>
                        <p className="text-sm text-slate-500 truncate max-w-[200px]">{t.description || 'No description'}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'patientid',
            label: 'Patient',
            render: (t: Treatment) => (
                <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    <span>{getPatientName(t.patientid)}</span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (t: Treatment) => (
                <Badge variant={statusColors[t.status || 'Active'] || 'default'}>
                    {t.status || 'Active'}
                </Badge>
            ),
        },
        {
            key: 'startdate',
            label: 'Start Date',
            sortable: true,
            render: (t: Treatment) => t.startdate ? new Date(t.startdate).toLocaleDateString() : '-',
        },
        {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: () => (
                <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout
            title="Treatments"
            subtitle="Manage patient treatment plans"
            actions={
                <Button onClick={handleAddTreatment} className="flex items-center gap-2">
                    <Plus size={18} /> New Treatment
                </Button>
            }
        >
            <DataTable
                columns={columns}
                data={treatments}
                loading={loading}
                searchPlaceholder="Search treatments..."
                emptyMessage="No treatments found"
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Create New Treatment"
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Create Treatment</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Patient *</label>
                        <select
                            value={formData.patientid}
                            onChange={(e) => setFormData({ ...formData, patientid: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            required
                        >
                            <option value="">Select patient</option>
                            {patients.map(p => (
                                <option key={p.patientid} value={p.patientid}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Treatment Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="e.g., Root Canal, Braces, Whitening"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                            placeholder="Treatment details..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
