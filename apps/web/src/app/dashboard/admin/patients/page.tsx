"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Phone, MapPin } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPatients, createPatient, Patient } from '@/lib/api';

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        dateofbirth: '',
        gender: '',
        phone: '',
        address: '',
        medicalhistory: '',
    });

    const fetchPatients = async () => {
        setLoading(true);
        const result = await getPatients();
        if (result.data) {
            setPatients(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleAddPatient = () => {
        setSelectedPatient(null);
        setFormData({ name: '', dateofbirth: '', gender: '', phone: '', address: '', medicalhistory: '' });
        setModalOpen(true);
    };

    const handleEditPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setFormData({
            name: patient.name,
            dateofbirth: patient.dateofbirth?.split('T')[0] || '',
            gender: patient.gender || '',
            phone: patient.phone || '',
            address: patient.address || '',
            medicalhistory: patient.medicalhistory || '',
        });
        setModalOpen(true);
    };

    const handleDeletePatient = (patient: Patient) => {
        if (confirm(`Are you sure you want to delete ${patient.name}?`)) {
            // TODO: Call delete API
            setPatients(patients.filter(p => p.patientid !== patient.patientid));
        }
    };

    const handleSubmit = async () => {
        if (!selectedPatient) {
            await createPatient(formData);
        }
        // TODO: Implement update API
        setModalOpen(false);
        fetchPatients();
    };

    const calculateAge = (dob: string) => {
        if (!dob) return '-';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} yrs`;
    };

    const columns = [
        {
            key: 'name',
            label: 'Patient',
            sortable: true,
            render: (patient: Patient) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{patient.name}</p>
                        <p className="text-sm text-slate-500">
                            {patient.gender || 'Not specified'} • {calculateAge(patient.dateofbirth)}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'contact',
            label: 'Contact',
            render: (patient: Patient) => (
                <div className="space-y-1">
                    {patient.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={14} /> {patient.phone}
                        </div>
                    )}
                    {patient.address && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 truncate max-w-[200px]">
                            <MapPin size={14} /> {patient.address}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'dateofbirth',
            label: 'Birth Date',
            sortable: true,
            render: (patient: Patient) => (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={14} />
                    {patient.dateofbirth ? new Date(patient.dateofbirth).toLocaleDateString() : '-'}
                </div>
            ),
        },
        {
            key: 'medicalhistory',
            label: 'Medical History',
            render: (patient: Patient) => (
                <p className="text-sm text-slate-600 truncate max-w-[200px]">
                    {patient.medicalhistory || 'No history recorded'}
                </p>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: (patient: Patient) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleEditPatient(patient); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePatient(patient); }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout
            title="Patients"
            subtitle="Manage patient records and medical history"
            actions={
                <Button onClick={handleAddPatient} className="flex items-center gap-2">
                    <Plus size={18} /> Add Patient
                </Button>
            }
        >
            <DataTable
                columns={columns}
                data={patients}
                loading={loading}
                searchPlaceholder="Search patients..."
                emptyMessage="No patients found. Register your first patient!"
            />

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedPatient ? 'Edit Patient' : 'Register New Patient'}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            {selectedPatient ? 'Save Changes' : 'Register Patient'}
                        </Button>
                    </>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
                        <input
                            type="date"
                            value={formData.dateofbirth}
                            onChange={(e) => setFormData({ ...formData, dateofbirth: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="+92-300-1234567"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="City, Country"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Medical History</label>
                        <textarea
                            value={formData.medicalhistory}
                            onChange={(e) => setFormData({ ...formData, medicalhistory: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                            placeholder="Any allergies, chronic conditions, previous treatments..."
                        />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
