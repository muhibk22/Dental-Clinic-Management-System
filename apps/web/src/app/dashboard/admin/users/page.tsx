"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getUsers, createUser, updateUser, deleteUser, User, CreateUserDto, getDoctors, Doctor } from '@/lib/api';

const roleColors: Record<string, 'danger' | 'info' | 'success' | 'warning' | 'purple'> = {
    ADMIN: 'danger',
    DOCTOR: 'info',
    RECEPTIONIST: 'success',
    PHARMACIST: 'warning',
    ASSISTANT: 'purple',
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState<CreateUserDto>({
        username: '',
        password: '',
        role: 'DOCTOR',
        name: '',
        phone: '',
        specialization: '',
        email: '',
        doctorid: undefined,
    });

    const fetchData = async () => {
        setLoading(true);
        const [usersRes, doctorsRes] = await Promise.all([getUsers(), getDoctors()]);
        if (usersRes.data) setUsers(usersRes.data);
        if (doctorsRes.data) setDoctors(doctorsRes.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddUser = () => {
        setSelectedUser(null);
        setFormData({
            username: '',
            password: '',
            role: 'DOCTOR',
            name: '',
            phone: '',
            specialization: '',
            email: '',
            doctorid: undefined,
        });
        setError('');
        setModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            password: '',
            role: user.role,
            name: user.profile?.name || '',
            phone: user.profile?.phone || '',
            specialization: user.profile?.specialization || '',
            email: user.profile?.email || '',
        });
        setError('');
        setModalOpen(true);
    };

    const handleDeleteUser = async (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.username}?`)) {
            const result = await deleteUser(parseInt(user.userid));
            if (result.data) {
                fetchData();
            }
        }
    };

    // Phone validation helper
    const isValidPhone = (phone: string) => {
        const digits = phone.replace(/\D/g, '');
        return digits.length === 0 || digits.length === 11;
    };

    const getPhoneError = () => {
        if (!formData.phone) return '';
        const digits = formData.phone.replace(/\D/g, '');
        if (digits.length > 0 && digits.length !== 11) {
            return `Phone must be 11 digits (currently ${digits.length})`;
        }
        return '';
    };

    const handleSave = async () => {
        setError('');
        setSaving(true);

        // Validation
        if (!formData.username || !formData.role) {
            setError('Username and role are required');
            setSaving(false);
            return;
        }
        if (!selectedUser && !formData.password) {
            setError('Password is required for new users');
            setSaving(false);
            return;
        }
        if (formData.phone && !isValidPhone(formData.phone)) {
            setError('Phone number must be exactly 11 digits');
            setSaving(false);
            return;
        }
        if (formData.role === 'DOCTOR' && (!formData.specialization || !formData.email)) {
            setError('Doctors require specialization and email');
            setSaving(false);
            return;
        }
        if (formData.role === 'ASSISTANT' && !formData.doctorid) {
            setError('Assistants require a doctor assignment');
            setSaving(false);
            return;
        }

        let result;
        if (selectedUser) {
            // Update existing user
            result = await updateUser(parseInt(selectedUser.userid), {
                username: formData.username !== selectedUser.username ? formData.username : undefined,
                password: formData.password || undefined,
                name: formData.name || undefined,
                phone: formData.phone || undefined,
                specialization: formData.specialization || undefined,
                email: formData.email || undefined,
            });
        } else {
            // Create new user
            result = await createUser(formData);
        }


        if (result.error) {
            setError(result.error);
            setSaving(false);
            return;
        }

        setModalOpen(false);
        fetchData();
        setSaving(false);
    };

    const columns = [
        {
            key: 'username',
            label: 'Username',
            sortable: true,
            render: (user: User) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <span className="font-semibold text-slate-900 block">{user.username}</span>
                        {user.profile?.name && (
                            <span className="text-xs text-slate-500">{user.profile.name}</span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
            render: (user: User) => (
                <Badge variant={roleColors[user.role] || 'default'}>
                    {user.role}
                </Badge>
            ),
        },
        {
            key: 'contact',
            label: 'Contact',
            render: (user: User) => (
                <div className="text-sm">
                    {user.profile?.email && <div className="text-slate-600">{user.profile.email}</div>}
                    {user.profile?.phone && <div className="text-slate-500">{user.profile.phone}</div>}
                    {!user.profile?.email && !user.profile?.phone && <span className="text-slate-400">-</span>}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (user: User) => (
                <Badge variant={user.isdeleted ? 'danger' : 'success'}>
                    {user.isdeleted ? 'Inactive' : 'Active'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: (user: User) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleEditUser(user); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteUser(user); }}
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
            title="Users"
            subtitle="Manage system users and their roles"
            actions={
                <Button onClick={handleAddUser} className="flex items-center gap-2">
                    <Plus size={18} /> Add User
                </Button>
            }
        >
            <DataTable
                columns={columns}
                data={users}
                loading={loading}
                searchPlaceholder="Search users..."
                emptyMessage="No users found"
            />

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedUser ? 'Edit User' : 'Add New User'}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : selectedUser ? 'Save Changes' : 'Create User'}
                        </Button>
                    </>
                }
            >
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username *</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password {selectedUser ? '(leave blank to keep)' : '*'}
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder={selectedUser ? '••••••••' : 'Enter password'}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Role *</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            disabled={!!selectedUser}
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="DOCTOR">Doctor</option>
                            <option value="RECEPTIONIST">Receptionist</option>
                            <option value="PHARMACIST">Pharmacist</option>
                            <option value="ASSISTANT">Assistant</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="Enter full name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone (11 digits)</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${getPhoneError() ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-teal-500'
                                }`}
                            placeholder="03001234567"
                            maxLength={15}
                        />
                        {getPhoneError() && (
                            <p className="text-red-500 text-xs mt-1">{getPhoneError()}</p>
                        )}
                    </div>

                    {/* Doctor-specific fields */}
                    {formData.role === 'DOCTOR' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Specialization *</label>
                                <input
                                    type="text"
                                    value={formData.specialization}
                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                    placeholder="e.g., Orthodontist"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                    placeholder="doctor@clinic.com"
                                />
                            </div>
                        </>
                    )}

                    {/* Assistant-specific fields */}
                    {formData.role === 'ASSISTANT' && (
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Assigned Doctor *</label>
                            <select
                                value={formData.doctorid || ''}
                                onChange={(e) => setFormData({ ...formData, doctorid: parseInt(e.target.value) || undefined })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            >
                                <option value="">Select a doctor</option>
                                {doctors.map(doc => (
                                    <option key={doc.doctorid} value={doc.doctorid}>
                                        {doc.name} - {doc.specialization}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </Modal>
        </DashboardLayout>
    );
}
