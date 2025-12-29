"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Package, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getMedicines, createMedicine, Medicine } from '@/lib/api';
import { useUserRole, canEdit } from '@/components/admin/Sidebar';

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
    });

    const userRole = useUserRole();
    const canEditMedicines = canEdit(userRole, 'medicines');

    const fetchData = async () => {
        setLoading(true);
        const result = await getMedicines();
        if (result.data) setMedicines(result.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddMedicine = () => {
        setFormData({ name: '', quantity: '', price: '' });
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        await createMedicine({
            name: formData.name,
            quantity: Number(formData.quantity),
            price: Number(formData.price),
        });
        setModalOpen(false);
        fetchData();
    };

    const lowStockCount = medicines.filter(m => m.quantity <= 10).length;
    const totalValue = medicines.reduce((sum, m) => sum + (m.quantity * Number(m.price)), 0);

    const columns = [
        {
            key: 'name',
            label: 'Medicine',
            sortable: true,
            render: (m: Medicine) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.quantity <= 10 ? 'bg-red-100' : 'bg-green-100'}`}>
                        <Package size={18} className={m.quantity <= 10 ? 'text-red-600' : 'text-green-600'} />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{m.name}</p>
                        {m.quantity <= 10 && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertTriangle size={12} /> Low stock
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'quantity',
            label: 'Stock',
            sortable: true,
            render: (m: Medicine) => (
                <span className={`font-semibold ${m.quantity <= 10 ? 'text-red-600' : m.quantity <= 25 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {m.quantity} units
                </span>
            ),
        },
        {
            key: 'price',
            label: 'Unit Price',
            sortable: true,
            render: (m: Medicine) => (
                <span className="font-medium">Rs. {Number(m.price).toLocaleString()}</span>
            ),
        },
        {
            key: 'value',
            label: 'Total Value',
            render: (m: Medicine) => (
                <span className="text-slate-600">Rs. {(m.quantity * Number(m.price)).toLocaleString()}</span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (m: Medicine) => (
                <Badge variant={m.quantity > 10 ? 'success' : m.quantity > 0 ? 'warning' : 'danger'}>
                    {m.quantity > 10 ? 'In Stock' : m.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                </Badge>
            ),
        },
        // Only show actions column if user can edit
        ...(canEditMedicines ? [{
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
        }] : []),
    ];

    return (
        <DashboardLayout
            title="Medicine Inventory"
            subtitle={canEditMedicines ? "Manage pharmacy stock and pricing" : "View pharmacy stock (Read-only)"}
            actions={
                canEditMedicines ? (
                    <Button onClick={handleAddMedicine} className="flex items-center gap-2">
                        <Plus size={18} /> Add Medicine
                    </Button>
                ) : null
            }
        >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Total Items</p>
                    <p className="text-2xl font-bold text-slate-900">{medicines.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Low Stock Alerts</p>
                    <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Inventory Value</p>
                    <p className="text-2xl font-bold text-green-600">Rs. {totalValue.toLocaleString()}</p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={medicines}
                loading={loading}
                searchPlaceholder="Search medicines..."
                emptyMessage="No medicines in inventory"
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Add Medicine"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Add Medicine</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Medicine Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="e.g., Amoxicillin 500mg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Quantity *</label>
                        <input
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="100"
                            min="0"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Unit Price (Rs.) *</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="450"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
