"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Phone, MapPin } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import FormTextarea from '@/components/ui/FormTextarea';
import ActionButton from '@/components/ui/ActionButton';
import TableActions from '@/components/ui/TableActions';
import { getPatients, createPatient, updatePatient, deletePatient, Patient } from '@/lib/api';
import { genderOptions } from '@/lib/constants';

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', dateofbirth: '', gender: '', phone: '', address: '', medicalhistory: '' });

    const fetchPatients = async () => {
        setLoading(true);
        const result = await getPatients();
        if (result.data) setPatients(result.data);
        setLoading(false);
    };

    useEffect(() => { fetchPatients(); }, []);

    const handleAddPatient = () => {
        setSelectedPatient(null);
        setFormData({ name: '', dateofbirth: '', gender: '', phone: '', address: '', medicalhistory: '' });
        setError('');
        setModalOpen(true);
    };

    const handleEditPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setFormData({
            name: patient.name, dateofbirth: patient.dateofbirth?.split('T')[0] || '',
            gender: patient.gender || '', phone: patient.phone || '',
            address: patient.address || '', medicalhistory: patient.medicalhistory || '',
        });
        setError('');
        setModalOpen(true);
    };

    const handleDeletePatient = async (patient: Patient) => {
        if (confirm(`Are you sure you want to delete ${patient.name}?`)) {
            const result = await deletePatient(patient.patientid);
            if (result.data) fetchPatients();
            if (result.error) alert(result.error);
        }
    };

    const handleSubmit = async () => {
        setError(''); setSaving(true);
        if (!formData.name || !formData.dateofbirth) { setError('Name and date of birth are required'); setSaving(false); return; }

        let result;
        if (selectedPatient) {
            result = await updatePatient(selectedPatient.patientid, formData);
        } else {
            result = await createPatient(formData);
        }
        if (result.error) { setError(result.error); setSaving(false); return; }
        setModalOpen(false);
        fetchPatients();
        setSaving(false);
    };

    const calculateAge = (dob: string) => {
        if (!dob) return '-';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return `${age} yrs`;
    };

    const columns = [
        {
            key: 'name', label: 'Patient', sortable: true,
            render: (patient: Patient) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <div><p className="font-semibold text-slate-900">{patient.name}</p><p className="text-sm text-slate-500">{patient.gender || 'Not specified'} • {calculateAge(patient.dateofbirth)}</p></div>
                </div>
            ),
        },
        {
            key: 'contact', label: 'Contact',
            render: (patient: Patient) => (
                <div className="space-y-1">
                    {patient.phone && <div className="flex items-center gap-2 text-sm text-slate-600"><Phone size={14} /> {patient.phone}</div>}
                    {patient.address && <div className="flex items-center gap-2 text-sm text-slate-500 truncate max-w-[200px]"><MapPin size={14} /> {patient.address}</div>}
                </div>
            ),
        },
        { key: 'dateofbirth', label: 'Birth Date', sortable: true, render: (patient: Patient) => <div className="flex items-center gap-2 text-sm text-slate-600"><Calendar size={14} />{patient.dateofbirth ? new Date(patient.dateofbirth).toLocaleDateString() : '-'}</div> },
        { key: 'medicalhistory', label: 'Medical History', render: (patient: Patient) => <p className="text-sm text-slate-600 truncate max-w-[200px]">{patient.medicalhistory || 'No history recorded'}</p> },
        {
            key: 'actions', label: 'Actions', className: 'text-right',
            render: (patient: Patient) => (
                <TableActions>
                    <ActionButton icon={Edit2} onClick={() => handleEditPatient(patient)} variant="edit" title="Edit" />
                    <ActionButton icon={Trash2} onClick={() => handleDeletePatient(patient)} variant="delete" title="Delete" />
                </TableActions>
            ),
        },
    ];

    return (
        <DashboardLayout title="Patients" subtitle="Manage patient records and medical history" actions={<Button onClick={handleAddPatient} className="flex items-center gap-2"><Plus size={18} /> Add Patient</Button>}>
            <DataTable columns={columns} data={patients} loading={loading} searchPlaceholder="Search patients..." emptyMessage="No patients found. Register your first patient!" />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedPatient ? 'Edit Patient' : 'Register New Patient'} size="lg"
                footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : selectedPatient ? 'Save Changes' : 'Register Patient'}</Button></>}>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Full Name" required className="md:col-span-2" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                    <FormField label="Date of Birth" required type="date" value={formData.dateofbirth} onChange={(e) => setFormData({ ...formData, dateofbirth: e.target.value })} />
                    <FormSelect label="Gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} options={genderOptions} placeholder="Select gender" />
                    <FormField label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+92-300-1234567" />
                    <FormField label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="City, Country" />
                    <FormTextarea label="Medical History" className="md:col-span-2" value={formData.medicalhistory} onChange={(e) => setFormData({ ...formData, medicalhistory: e.target.value })} rows={3} placeholder="Any allergies, chronic conditions, previous treatments..." />
                </div>
            </Modal>
        </DashboardLayout>
    );
}
