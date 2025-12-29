"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface User {
    userid: string;
    username: string;
    role: string;
    isdeleted: boolean;
}

// Demo data since we don't have a users endpoint yet
const demoUsers: User[] = [
    { userid: '1', username: 'admin', role: 'ADMIN', isdeleted: false },
    { userid: '2', username: 'doctor1', role: 'DOCTOR', isdeleted: false },
    { userid: '3', username: 'receptionist', role: 'RECEPTIONIST', isdeleted: false },
    { userid: '4', username: 'pharmacist', role: 'PHARMACIST', isdeleted: false },
    { userid: '5', username: 'assistant', role: 'ASSISTANT', isdeleted: false },
];

const roleColors: Record<string, 'danger' | 'info' | 'success' | 'warning' | 'purple'> = {
    ADMIN: 'danger',
    DOCTOR: 'info',
    RECEPTIONIST: 'success',
    PHARMACIST: 'warning',
    ASSISTANT: 'purple',
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        // TODO: Replace with actual API call when users endpoint is available
        setTimeout(() => {
            setUsers(demoUsers);
            setLoading(false);
        }, 500);
    }, []);

    const handleAddUser = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.username}?`)) {
            setUsers(users.filter(u => u.userid !== user.userid));
        }
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
                    <span className="font-semibold text-slate-900">{user.username}</span>
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
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setModalOpen(false)}>
                            {selectedUser ? 'Save Changes' : 'Create User'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <input
                            type="text"
                            defaultValue={selectedUser?.username || ''}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder={selectedUser ? '••••••••' : 'Enter password'}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                        <select
                            defaultValue={selectedUser?.role || 'DOCTOR'}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="DOCTOR">Doctor</option>
                            <option value="RECEPTIONIST">Receptionist</option>
                            <option value="PHARMACIST">Pharmacist</option>
                            <option value="ASSISTANT">Assistant</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
