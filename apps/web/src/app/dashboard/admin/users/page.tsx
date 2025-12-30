"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import ActionButton from '@/components/ui/ActionButton';
import TableActions from '@/components/ui/TableActions';
import { getUsers, createUser, updateUser, deleteUser, getDoctors, User, Doctor, CreateUserDto } from '@/lib/api';
import { roleColors, roleOptions } from '@/lib/constants';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<CreateUserDto>({
        username: '', password: '', role: 'DOCTOR', name: '', phone: '', specialization: '', email: '', doctorid: undefined,
    });

    const fetchData = async () => {
        setLoading(true);
        const [usersRes, doctorsRes] = await Promise.all([getUsers(), getDoctors()]);
        if (usersRes.data) setUsers(usersRes.data);
        if (doctorsRes.data) setDoctors(doctorsRes.data);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddUser = () => {
        setSelectedUser(null);
        setFormData({ username: '', password: '', role: 'DOCTOR', name: '', phone: '', specialization: '', email: '', doctorid: undefined });
        setError('');
        setModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setFormData({
            username: user.username, password: '', role: user.role,
            name: user.profile?.name || '', phone: user.profile?.phone || '',
            specialization: user.profile?.specialization || '', email: user.profile?.email || '',
        });
        setError('');
        setModalOpen(true);
    };

    const handleDeleteUser = async (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.username}?`)) {
            const result = await deleteUser(parseInt(user.userid));
            if (result.data) fetchData();
        }
    };

    const isValidPhone = (phone: string) => {
        const digits = phone.replace(/\D/g, '');
        return digits.length === 0 || digits.length === 11;
    };

    const getPhoneError = () => {
        if (!formData.phone) return '';
        const digits = formData.phone.replace(/\D/g, '');
        if (digits.length > 0 && digits.length !== 11) return `Phone must be 11 digits (currently ${digits.length})`;
        return '';
    };

    const handleSave = async () => {
        setError('');
        setSaving(true);

        if (!formData.username || !formData.role) { setError('Username and role are required'); setSaving(false); return; }
        if (!selectedUser && !formData.password) { setError('Password is required for new users'); setSaving(false); return; }
        if (formData.phone && !isValidPhone(formData.phone)) { setError('Phone number must be exactly 11 digits'); setSaving(false); return; }
        if (formData.role === 'DOCTOR' && (!formData.specialization || !formData.email)) { setError('Doctors require specialization and email'); setSaving(false); return; }
        if (formData.role === 'ASSISTANT' && !formData.doctorid) { setError('Assistants require a doctor assignment'); setSaving(false); return; }

        let result;
        if (selectedUser) {
            result = await updateUser(parseInt(selectedUser.userid), {
                username: formData.username !== selectedUser.username ? formData.username : undefined,
                password: formData.password || undefined, name: formData.name || undefined,
                phone: formData.phone || undefined, specialization: formData.specialization || undefined, email: formData.email || undefined,
            });
        } else {
            result = await createUser(formData);
        }

        if (result.error) { setError(result.error); setSaving(false); return; }
        setModalOpen(false);
        fetchData();
        setSaving(false);
    };

    const doctorOptions = doctors.map(doc => ({ value: doc.doctorid, label: `${doc.name} - ${doc.specialization}` }));

    const columns = [
        {
            key: 'username', label: 'Username', sortable: true,
            render: (user: User) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">{user.username.charAt(0).toUpperCase()}</div>
                    <div><span className="font-semibold text-slate-900 block">{user.username}</span>{user.profile?.name && <span className="text-xs text-slate-500">{user.profile.name}</span>}</div>
                </div>
            ),
        },
        { key: 'role', label: 'Role', sortable: true, render: (user: User) => <Badge variant={roleColors[user.role as keyof typeof roleColors] || 'default'}>{user.role}</Badge> },
        {
            key: 'contact', label: 'Contact',
            render: (user: User) => (
                <div className="text-sm">
                    {user.profile?.email && <div className="text-slate-600">{user.profile.email}</div>}
                    {user.profile?.phone && <div className="text-slate-500">{user.profile.phone}</div>}
                    {!user.profile?.email && !user.profile?.phone && <span className="text-slate-400">-</span>}
                </div>
            ),
        },
        { key: 'status', label: 'Status', render: (user: User) => <Badge variant={user.isdeleted ? 'danger' : 'success'}>{user.isdeleted ? 'Inactive' : 'Active'}</Badge> },
        {
            key: 'actions', label: 'Actions', className: 'text-right',
            render: (user: User) => (
                <TableActions>
                    <ActionButton icon={Edit2} onClick={() => handleEditUser(user)} variant="edit" title="Edit" />
                    <ActionButton icon={Trash2} onClick={() => handleDeleteUser(user)} variant="delete" title="Delete" />
                </TableActions>
            ),
        },
    ];

    return (
        <DashboardLayout title="Users" subtitle="Manage system users and their roles" actions={<Button onClick={handleAddUser} className="flex items-center gap-2"><Plus size={18} /> Add User</Button>}>
            <DataTable columns={columns} data={users} loading={loading} searchPlaceholder="Search users..." emptyMessage="No users found" />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedUser ? 'Edit User' : 'Add New User'} size="lg"
                footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : selectedUser ? 'Save Changes' : 'Create User'}</Button></>}>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Username" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Enter username" />
                    <FormField label={selectedUser ? 'Password (leave blank to keep)' : 'Password'} required={!selectedUser} type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={selectedUser ? '••••••••' : 'Enter password'} />
                    <FormSelect label="Role" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} options={roleOptions} disabled={!!selectedUser} placeholder="Select role" />
                    <FormField label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" />
                    <FormField label="Phone (11 digits)" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="03001234567" maxLength={15} error={getPhoneError()} />
                    {formData.role === 'DOCTOR' && (<><FormField label="Specialization" required value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} placeholder="e.g., Orthodontist" /><FormField label="Email" required type="email" className="md:col-span-2" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="doctor@clinic.com" /></>)}
                    {formData.role === 'ASSISTANT' && <FormSelect label="Assigned Doctor" required className="md:col-span-2" value={formData.doctorid || ''} onChange={(e) => setFormData({ ...formData, doctorid: parseInt(e.target.value) || undefined })} options={doctorOptions} placeholder="Select a doctor" />}
                </div>
            </Modal>
        </DashboardLayout>
    );
}
