"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Clock, User, Stethoscope } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import FormSelect from '@/components/ui/FormSelect';
import FormTextarea from '@/components/ui/FormTextarea';
import FormField from '@/components/ui/FormField';
import ActionButton from '@/components/ui/ActionButton';
import TableActions from '@/components/ui/TableActions';
import { getAppointments, getPatients, getDoctors, createAppointment, updateAppointment, deleteAppointment, Appointment, Patient, Doctor } from '@/lib/api';

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ patientid: '', doctorid: '', appointmenttime: '', notes: '', status: 'Scheduled' });

    const fetchData = async () => {
        setLoading(true);
        const [aptRes, patRes, docRes] = await Promise.all([getAppointments(), getPatients(), getDoctors()]);
        if (aptRes.data) setAppointments(aptRes.data);
        if (patRes.data) setPatients(patRes.data);
        if (docRes.data) setDoctors(docRes.data);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddAppointment = () => {
        setSelectedAppointment(null);
        setFormData({ patientid: '', doctorid: '', appointmenttime: '', notes: '', status: 'Scheduled' });
        setError('');
        setModalOpen(true);
    };

    const handleEditAppointment = (apt: Appointment) => {
        setSelectedAppointment(apt);
        const datetime = apt.appointmenttime ? new Date(apt.appointmenttime).toISOString().slice(0, 16) : '';
        setFormData({
            patientid: String(apt.patientid), doctorid: String(apt.doctorid),
            appointmenttime: datetime, notes: apt.notes || '', status: apt.status || 'Scheduled',
        });
        setError('');
        setModalOpen(true);
    };

    const handleDeleteAppointment = async (apt: Appointment) => {
        if (confirm(`Are you sure you want to delete this appointment?`)) {
            const result = await deleteAppointment(apt.appointmentid);
            if (result.data) fetchData();
            if (result.error) alert(result.error);
        }
    };

    const handleSubmit = async () => {
        setError(''); setSaving(true);
        if (!formData.patientid || !formData.doctorid || !formData.appointmenttime) {
            setError('Patient, doctor, and appointment time are required');
            setSaving(false); return;
        }

        let result;
        if (selectedAppointment) {
            result = await updateAppointment(selectedAppointment.appointmentid, {
                patientid: Number(formData.patientid), doctorid: Number(formData.doctorid),
                appointmenttime: formData.appointmenttime, notes: formData.notes,
            });
        } else {
            result = await createAppointment({
                patientid: Number(formData.patientid), doctorid: Number(formData.doctorid),
                appointmenttime: formData.appointmenttime, notes: formData.notes,
            });
        }
        if (result.error) { setError(result.error); setSaving(false); return; }
        setModalOpen(false);
        fetchData();
        setSaving(false);
    };

    const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = { Scheduled: 'info', Completed: 'success', Cancelled: 'danger' };

    const patientOptions = patients.map(p => ({ value: p.patientid, label: p.name }));
    const doctorOptions = doctors.map(d => ({ value: d.doctorid, label: d.name }));

    const columns = [
        { key: 'patient', label: 'Patient', render: (apt: Appointment) => <div className="flex items-center gap-2"><User size={16} className="text-slate-400" /><span className="font-medium">{apt.patient?.name || `Patient #${apt.patientid}`}</span></div> },
        { key: 'doctor', label: 'Doctor', render: (apt: Appointment) => <div className="flex items-center gap-2"><Stethoscope size={16} className="text-teal-500" /><span>{apt.doctor?.name || `Doctor #${apt.doctorid}`}</span></div> },
        { key: 'appointmenttime', label: 'Date & Time', sortable: true, render: (apt: Appointment) => <div className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /><span>{new Date(apt.appointmenttime).toLocaleString()}</span></div> },
        { key: 'status', label: 'Status', sortable: true, render: (apt: Appointment) => <Badge variant={statusColors[apt.status || 'Scheduled'] || 'default'}>{apt.status || 'Scheduled'}</Badge> },
        { key: 'notes', label: 'Notes', render: (apt: Appointment) => <span className="text-sm text-slate-500 truncate max-w-[150px] block">{apt.notes || '-'}</span> },
        {
            key: 'actions', label: 'Actions', className: 'text-right', render: (apt: Appointment) => (
                <TableActions>
                    <ActionButton icon={Edit2} onClick={() => handleEditAppointment(apt)} variant="edit" title="Edit" />
                    <ActionButton icon={Trash2} onClick={() => handleDeleteAppointment(apt)} variant="delete" title="Delete" />
                </TableActions>
            )
        },
    ];

    return (
        <DashboardLayout title="Appointments" subtitle="Manage patient appointments and schedules" actions={<Button onClick={handleAddAppointment} className="flex items-center gap-2"><Plus size={18} /> Book Appointment</Button>}>
            <DataTable columns={columns} data={appointments} loading={loading} searchPlaceholder="Search appointments..." emptyMessage="No appointments scheduled" />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedAppointment ? 'Edit Appointment' : 'Book New Appointment'} size="lg"
                footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : selectedAppointment ? 'Update' : 'Book Appointment'}</Button></>}>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect label="Patient" required value={formData.patientid} onChange={(e) => setFormData({ ...formData, patientid: e.target.value })} options={patientOptions} placeholder="Select patient" />
                    <FormSelect label="Doctor" required value={formData.doctorid} onChange={(e) => setFormData({ ...formData, doctorid: e.target.value })} options={doctorOptions} placeholder="Select doctor" />
                    <FormField label="Date & Time" required type="datetime-local" className="md:col-span-2" value={formData.appointmenttime} onChange={(e) => setFormData({ ...formData, appointmenttime: e.target.value })} />
                    <FormTextarea label="Notes" className="md:col-span-2" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} placeholder="Additional notes or reason for visit..." />
                </div>
            </Modal>
        </DashboardLayout>
    );
}
