"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import ActionButton from '@/components/ui/ActionButton';
import TableActions from '@/components/ui/TableActions';
import { getDoctors, createUser, updateUser, deleteUser, getUsers, Doctor, User } from '@/lib/api';
import { useUserRole, canEdit } from '@/components/admin/Sidebar';
import { specializationOptions } from '@/lib/constants';

interface DoctorFormData { username: string; password: string; name: string; specialization: string; email: string; phone: string; }

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctorUsers, setDoctorUsers] = useState<Map<number, User>>(new Map());
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<DoctorFormData>({ username: '', password: '', name: '', specialization: '', email: '', phone: '' });

    const userRole = useUserRole();
    const canEditDoctors = canEdit(userRole, 'doctors');

    const fetchDoctors = async () => {
        setLoading(true);
        const [doctorsResult, usersResult] = await Promise.all([getDoctors(), getUsers()]);
        if (doctorsResult.data) setDoctors(doctorsResult.data);
        if (usersResult.data) {
            const userMap = new Map<number, User>();
            usersResult.data.forEach(u => { if (u.role === 'DOCTOR') userMap.set(parseInt(u.userid), u); });
            setDoctorUsers(userMap);
        }
        setLoading(false);
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleAddDoctor = () => { setSelectedDoctor(null); setFormData({ username: '', password: '', name: '', specialization: '', email: '', phone: '' }); setError(''); setModalOpen(true); };
    const handleEditDoctor = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        const user = doctorUsers.get(doctor.userid);
        setFormData({ username: user?.username || '', password: '', name: doctor.name, specialization: doctor.specialization || '', email: doctor.email || '', phone: doctor.phone || '' });
        setError(''); setModalOpen(true);
    };
    const handleDeleteDoctor = async (doctor: Doctor) => { if (confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) { const result = await deleteUser(doctor.userid); if (result.data) fetchDoctors(); } };

    const getPhoneError = () => { if (!formData.phone) return ''; const digits = formData.phone.replace(/\D/g, ''); if (digits.length > 0 && digits.length !== 11) return `Phone must be 11 digits (currently ${digits.length})`; return ''; };

    const handleSubmit = async () => {
        setError(''); setSaving(true);
        if (!formData.name || !formData.specialization || !formData.email) { setError('Name, specialization, and email are required'); setSaving(false); return; }
        if (!selectedDoctor && (!formData.username || !formData.password)) { setError('Username and password are required for new doctors'); setSaving(false); return; }
        if (formData.phone) { const digits = formData.phone.replace(/\D/g, ''); if (digits.length !== 11) { setError('Phone must be exactly 11 digits'); setSaving(false); return; } }

        let result;
        if (selectedDoctor) {
            result = await updateUser(selectedDoctor.userid, { username: formData.username || undefined, password: formData.password || undefined, name: formData.name, phone: formData.phone || undefined, specialization: formData.specialization, email: formData.email });
        } else {
            result = await createUser({ username: formData.username, password: formData.password, role: 'DOCTOR', name: formData.name, phone: formData.phone || undefined, specialization: formData.specialization, email: formData.email });
        }
        if (result.error) { setError(result.error); setSaving(false); return; }
        setModalOpen(false); fetchDoctors(); setSaving(false);
    };

    const columns = [
        {
            key: 'name', label: 'Doctor', sortable: true, render: (doctor: Doctor) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <div><p className="font-semibold text-slate-900">{doctor.name}</p><p className="text-sm text-slate-500">{doctor.specialization || 'General'}</p></div>
                </div>
            )
        },
        {
            key: 'email', label: 'Contact', render: (doctor: Doctor) => (
                <div className="space-y-1">
                    {doctor.email && <div className="flex items-center gap-2 text-sm text-slate-600"><Mail size={14} /> {doctor.email}</div>}
                    {doctor.phone && <div className="flex items-center gap-2 text-sm text-slate-600"><Phone size={14} /> {doctor.phone}</div>}
                </div>
            )
        },
        { key: 'specialization', label: 'Specialization', sortable: true, render: (doctor: Doctor) => <Badge variant="info">{doctor.specialization || 'General'}</Badge> },
        ...(canEditDoctors ? [{
            key: 'actions', label: 'Actions', className: 'text-right', render: (doctor: Doctor) => (
                <TableActions>
                    <ActionButton icon={Edit2} onClick={() => handleEditDoctor(doctor)} variant="edit" title="Edit" />
                    <ActionButton icon={Trash2} onClick={() => handleDeleteDoctor(doctor)} variant="delete" title="Delete" />
                </TableActions>
            )
        }] : []),
    ];

    return (
        <DashboardLayout title="Doctors" subtitle={canEditDoctors ? "Manage doctor profiles and specializations" : "View doctor profiles (Read-only)"} actions={canEditDoctors ? <Button onClick={handleAddDoctor} className="flex items-center gap-2"><Plus size={18} /> Add Doctor</Button> : null}>
            <DataTable columns={columns} data={doctors} loading={loading} searchPlaceholder="Search doctors..." emptyMessage="No doctors found. Add your first doctor!" />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'} size="lg"
                footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : selectedDoctor ? 'Save Changes' : 'Add Doctor'}</Button></>}>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!selectedDoctor && <><FormField label="Username" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="drsmith" /><FormField label="Password" required type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" /></>}
                    {selectedDoctor && <FormField label="New Password (leave blank to keep current)" type="password" className="md:col-span-2" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />}
                    <FormField label="Full Name" required className="md:col-span-2" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Dr. John Smith" />
                    <FormSelect label="Specialization" required value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} options={specializationOptions} placeholder="Select specialization" />
                    <FormField label="Email" required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="doctor@clinic.com" />
                    <FormField label="Phone (11 digits)" className="md:col-span-2" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="03001234567" maxLength={15} error={getPhoneError()} />
                </div>
            </Modal>
        </DashboardLayout>
    );
}
