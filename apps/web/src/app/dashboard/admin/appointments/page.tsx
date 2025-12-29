"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Clock, User, Stethoscope } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getAppointments, getPatients, getDoctors, createAppointment, Appointment, Patient, Doctor } from '@/lib/api';

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientid: '',
        doctorid: '',
        appointmenttime: '',
        notes: '',
    });

    const fetchData = async () => {
        setLoading(true);
        const [aptRes, patRes, docRes] = await Promise.all([
            getAppointments(),
            getPatients(),
            getDoctors(),
        ]);
        if (aptRes.data) setAppointments(aptRes.data);
        if (patRes.data) setPatients(patRes.data);
        if (docRes.data) setDoctors(docRes.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddAppointment = () => {
        setFormData({ patientid: '', doctorid: '', appointmenttime: '', notes: '' });
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        await createAppointment({
            patientid: Number(formData.patientid),
            doctorid: Number(formData.doctorid),
            appointmenttime: formData.appointmenttime,
            notes: formData.notes,
        });
        setModalOpen(false);
        fetchData();
    };

    const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
        Scheduled: 'info',
        Completed: 'success',
        Cancelled: 'danger',
    };

    const columns = [
        {
            key: 'patient',
            label: 'Patient',
            render: (apt: Appointment) => (
                <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    <span className="font-medium">{apt.patient?.name || `Patient #${apt.patientid}`}</span>
                </div>
            ),
        },
        {
            key: 'doctor',
            label: 'Doctor',
            render: (apt: Appointment) => (
                <div className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-teal-500" />
                    <span>{apt.doctor?.name || `Doctor #${apt.doctorid}`}</span>
                </div>
            ),
        },
        {
            key: 'appointmenttime',
            label: 'Date & Time',
            sortable: true,
            render: (apt: Appointment) => (
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <span>{new Date(apt.appointmenttime).toLocaleString()}</span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (apt: Appointment) => (
                <Badge variant={statusColors[apt.status || 'Scheduled'] || 'default'}>
                    {apt.status || 'Scheduled'}
                </Badge>
            ),
        },
        {
            key: 'notes',
            label: 'Notes',
            render: (apt: Appointment) => (
                <span className="text-sm text-slate-500 truncate max-w-[150px] block">
                    {apt.notes || '-'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: (apt: Appointment) => (
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
            title="Appointments"
            subtitle="Manage patient appointments and schedules"
            actions={
                <Button onClick={handleAddAppointment} className="flex items-center gap-2">
                    <Plus size={18} /> Book Appointment
                </Button>
            }
        >
            <DataTable
                columns={columns}
                data={appointments}
                loading={loading}
                searchPlaceholder="Search appointments..."
                emptyMessage="No appointments scheduled"
            />

            {/* Add Appointment Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Book New Appointment"
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Book Appointment</Button>
                    </>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Doctor *</label>
                        <select
                            value={formData.doctorid}
                            onChange={(e) => setFormData({ ...formData, doctorid: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            required
                        >
                            <option value="">Select doctor</option>
                            {doctors.map(d => (
                                <option key={d.doctorid} value={d.doctorid}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date & Time *</label>
                        <input
                            type="datetime-local"
                            value={formData.appointmenttime}
                            onChange={(e) => setFormData({ ...formData, appointmenttime: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                            placeholder="Additional notes or reason for visit..."
                        />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
