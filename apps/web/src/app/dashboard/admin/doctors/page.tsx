"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getDoctors, createDoctor, Doctor } from '@/lib/api';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        email: '',
        phone: '',
    });

    const fetchDoctors = async () => {
        setLoading(true);
        const result = await getDoctors();
        if (result.data) {
            setDoctors(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleAddDoctor = () => {
        setSelectedDoctor(null);
        setFormData({ name: '', specialization: '', email: '', phone: '' });
        setModalOpen(true);
    };

    const handleEditDoctor = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setFormData({
            name: doctor.name,
            specialization: doctor.specialization || '',
            email: doctor.email || '',
            phone: doctor.phone || '',
        });
        setModalOpen(true);
    };

    const handleDeleteDoctor = (doctor: Doctor) => {
        if (confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
            // TODO: Call delete API
            setDoctors(doctors.filter(d => d.doctorid !== doctor.doctorid));
        }
    };

    const handleSubmit = async () => {
        // TODO: Implement create/update API calls
        setModalOpen(false);
        fetchDoctors();
    };

    const columns = [
        {
            key: 'name',
            label: 'Doctor',
            sortable: true,
            render: (doctor: Doctor) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{doctor.name}</p>
                        <p className="text-sm text-slate-500">{doctor.specialization || 'General'}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Contact',
            render: (doctor: Doctor) => (
                <div className="space-y-1">
                    {doctor.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail size={14} /> {doctor.email}
                        </div>
                    )}
                    {doctor.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={14} /> {doctor.phone}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'specialization',
            label: 'Specialization',
            sortable: true,
            render: (doctor: Doctor) => (
                <Badge variant="info">{doctor.specialization || 'General'}</Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: (doctor: Doctor) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleEditDoctor(doctor); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteDoctor(doctor); }}
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
            title="Doctors"
            subtitle="Manage doctor profiles and specializations"
            actions={
                <Button onClick={handleAddDoctor} className="flex items-center gap-2">
                    <Plus size={18} /> Add Doctor
                </Button>
            }
        >
            <DataTable
                columns={columns}
                data={doctors}
                loading={loading}
                searchPlaceholder="Search doctors..."
                emptyMessage="No doctors found. Add your first doctor!"
            />

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            {selectedDoctor ? 'Save Changes' : 'Add Doctor'}
                        </Button>
                    </>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="Dr. John Smith"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Specialization</label>
                        <select
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                            <option value="">Select specialization</option>
                            <option value="General Dentistry">General Dentistry</option>
                            <option value="Orthodontics">Orthodontics</option>
                            <option value="Periodontics">Periodontics</option>
                            <option value="Endodontics">Endodontics</option>
                            <option value="Oral Surgery">Oral Surgery</option>
                            <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                            <option value="Prosthodontics">Prosthodontics</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="doctor@clinic.com"
                        />
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
                </div>
            </Modal>
        </DashboardLayout>
    );
}
