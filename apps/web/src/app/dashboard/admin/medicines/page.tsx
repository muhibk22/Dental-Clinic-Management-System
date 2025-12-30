"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Package, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import { QuickStat, QuickStatsGrid } from '@/components/admin/QuickStats';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import ActionButton from '@/components/ui/ActionButton';
import TableActions from '@/components/ui/TableActions';
import { getMedicines, createMedicine, updateMedicine, deleteMedicine, Medicine } from '@/lib/api';
import { useUserRole, canEdit } from '@/components/admin/Sidebar';

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', quantity: '', price: '' });

    const userRole = useUserRole();
    const canEditMedicines = canEdit(userRole, 'medicines');

    const fetchData = async () => { setLoading(true); const result = await getMedicines(); if (result.data) setMedicines(result.data); setLoading(false); };

    useEffect(() => { fetchData(); }, []);

    const handleAddMedicine = () => { setSelectedMedicine(null); setFormData({ name: '', quantity: '', price: '' }); setError(''); setModalOpen(true); };

    const handleEditMedicine = (medicine: Medicine) => {
        setSelectedMedicine(medicine);
        setFormData({ name: medicine.name, quantity: String(medicine.quantity), price: String(medicine.price) });
        setError('');
        setModalOpen(true);
    };

    const handleDeleteMedicine = async (medicine: Medicine) => {
        if (confirm(`Are you sure you want to delete "${medicine.name}"?`)) {
            const result = await deleteMedicine(medicine.medicineid);
            if (result.data) fetchData();
            if (result.error) alert(result.error);
        }
    };

    const handleSubmit = async () => {
        setError(''); setSaving(true);
        if (!formData.name || !formData.quantity || !formData.price) { setError('All fields are required'); setSaving(false); return; }

        let result;
        if (selectedMedicine) {
            result = await updateMedicine(selectedMedicine.medicineid, {
                name: formData.name, quantity: Number(formData.quantity), price: Number(formData.price),
            });
        } else {
            result = await createMedicine({
                name: formData.name, quantity: Number(formData.quantity), price: Number(formData.price),
            });
        }
        if (result.error) { setError(result.error); setSaving(false); return; }
        setModalOpen(false);
        fetchData();
        setSaving(false);
    };

    const lowStockCount = medicines.filter(m => m.quantity <= 10).length;
    const totalValue = medicines.reduce((sum, m) => sum + (m.quantity * Number(m.price)), 0);

    const columns = [
        {
            key: 'name', label: 'Medicine', sortable: true, render: (m: Medicine) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.quantity <= 10 ? 'bg-red-100' : 'bg-green-100'}`}><Package size={18} className={m.quantity <= 10 ? 'text-red-600' : 'text-green-600'} /></div>
                    <div><p className="font-semibold text-slate-900">{m.name}</p>{m.quantity <= 10 && <p className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> Low stock</p>}</div>
                </div>
            )
        },
        { key: 'quantity', label: 'Stock', sortable: true, render: (m: Medicine) => <span className={`font-semibold ${m.quantity <= 10 ? 'text-red-600' : m.quantity <= 25 ? 'text-yellow-600' : 'text-green-600'}`}>{m.quantity} units</span> },
        { key: 'price', label: 'Unit Price', sortable: true, render: (m: Medicine) => <span className="font-medium">Rs. {Number(m.price).toLocaleString()}</span> },
        { key: 'value', label: 'Total Value', render: (m: Medicine) => <span className="text-slate-600">Rs. {(m.quantity * Number(m.price)).toLocaleString()}</span> },
        { key: 'status', label: 'Status', render: (m: Medicine) => <Badge variant={m.quantity > 10 ? 'success' : m.quantity > 0 ? 'warning' : 'danger'}>{m.quantity > 10 ? 'In Stock' : m.quantity > 0 ? 'Low Stock' : 'Out of Stock'}</Badge> },
        ...(canEditMedicines ? [{
            key: 'actions', label: 'Actions', className: 'text-right', render: (m: Medicine) => (
                <TableActions>
                    <ActionButton icon={Edit2} onClick={() => handleEditMedicine(m)} variant="edit" title="Edit" />
                    <ActionButton icon={Trash2} onClick={() => handleDeleteMedicine(m)} variant="delete" title="Delete" />
                </TableActions>
            )
        }] : []),
    ];

    return (
        <DashboardLayout title="Medicine Inventory" subtitle={canEditMedicines ? "Manage pharmacy stock and pricing" : "View pharmacy stock (Read-only)"} actions={canEditMedicines ? <Button onClick={handleAddMedicine} className="flex items-center gap-2"><Plus size={18} /> Add Medicine</Button> : null}>
            <QuickStatsGrid columns={3}>
                <QuickStat label="Total Items" value={medicines.length} />
                <QuickStat label="Low Stock Alerts" value={lowStockCount} color="red" />
                <QuickStat label="Inventory Value" value={`Rs. ${totalValue.toLocaleString()}`} color="green" />
            </QuickStatsGrid>
            <DataTable columns={columns} data={medicines} loading={loading} searchPlaceholder="Search medicines..." emptyMessage="No medicines in inventory" />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedMedicine ? 'Edit Medicine' : 'Add Medicine'}
                footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : selectedMedicine ? 'Update' : 'Add Medicine'}</Button></>}>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
                <div className="space-y-4">
                    <FormField label="Medicine Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Amoxicillin 500mg" />
                    <FormField label="Quantity" required type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="100" min={0} />
                    <FormField label="Unit Price (Rs.)" required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="450" min={0} step={0.01} />
                </div>
            </Modal>
        </DashboardLayout>
    );
}
