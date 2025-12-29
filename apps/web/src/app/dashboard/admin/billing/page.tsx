"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Receipt, User, CreditCard, DollarSign } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getBillings, getPatients, getAppointments, Billing, Patient, Appointment } from '@/lib/api';

export default function BillingPage() {
    const [billings, setBillings] = useState<Billing[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientid: '',
        appointmentid: '',
        totalamount: '',
        type: 'Standard',
        paymentstatus: 'Pending',
    });

    const fetchData = async () => {
        setLoading(true);
        const [billRes, patRes, aptRes] = await Promise.all([
            getBillings(),
            getPatients(),
            getAppointments(),
        ]);
        if (billRes.data) setBillings(billRes.data);
        if (patRes.data) setPatients(patRes.data);
        if (aptRes.data) setAppointments(aptRes.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getPatientName = (patientid: number) => {
        const patient = patients.find(p => p.patientid === patientid);
        return patient?.name || `Patient #${patientid}`;
    };

    const totalRevenue = billings.filter(b => b.paymentstatus === 'Paid' || b.paymentstatus === 'PAID').reduce((sum, b) => sum + Number(b.totalamount), 0);
    const pendingAmount = billings.filter(b => b.paymentstatus === 'Pending' || b.paymentstatus === 'PENDING').reduce((sum, b) => sum + Number(b.totalamount), 0);

    const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
        Paid: 'success',
        PAID: 'success',
        Pending: 'warning',
        PENDING: 'warning',
        Cancelled: 'danger',
        CANCELLED: 'danger',
    };

    const columns = [
        {
            key: 'billingid',
            label: 'Invoice #',
            sortable: true,
            render: (b: Billing) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Receipt size={18} className="text-blue-600" />
                    </div>
                    <span className="font-semibold text-slate-900">INV-{String(b.billingid).padStart(4, '0')}</span>
                </div>
            ),
        },
        {
            key: 'patientid',
            label: 'Patient',
            render: (b: Billing) => (
                <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    <span>{getPatientName(b.patientid)}</span>
                </div>
            ),
        },
        {
            key: 'totalamount',
            label: 'Amount',
            sortable: true,
            render: (b: Billing) => (
                <span className="font-bold text-slate-900">Rs. {Number(b.totalamount).toLocaleString()}</span>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (b: Billing) => (
                <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-slate-400" />
                    <span>{b.type}</span>
                </div>
            ),
        },
        {
            key: 'paymentstatus',
            label: 'Status',
            sortable: true,
            render: (b: Billing) => (
                <Badge variant={statusColors[b.paymentstatus || 'Pending'] || 'default'}>
                    {b.paymentstatus || 'Pending'}
                </Badge>
            ),
        },
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (b: Billing) => new Date(b.date).toLocaleDateString(),
        },
        {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: () => (
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit2 size={16} />
                </button>
            ),
        },
    ];

    return (
        <DashboardLayout
            title="Billing"
            subtitle="Manage invoices and payment records"
            actions={
                <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={18} /> Create Invoice
                </Button>
            }
        >
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Total Invoices</p>
                    <p className="text-2xl font-bold text-slate-900">{billings.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">Rs. {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Pending Payments</p>
                    <p className="text-2xl font-bold text-yellow-600">Rs. {pendingAmount.toLocaleString()}</p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={billings}
                loading={loading}
                searchPlaceholder="Search invoices..."
                emptyMessage="No billing records found"
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Create Invoice"
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => setModalOpen(false)}>Create Invoice</Button>
                    </>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Patient *</label>
                        <select
                            value={formData.patientid}
                            onChange={(e) => setFormData({ ...formData, patientid: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                            <option value="">Select patient</option>
                            {patients.map(p => (
                                <option key={p.patientid} value={p.patientid}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Appointment</label>
                        <select
                            value={formData.appointmentid}
                            onChange={(e) => setFormData({ ...formData, appointmentid: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                            <option value="">Select appointment</option>
                            {appointments.map(a => (
                                <option key={a.appointmentid} value={a.appointmentid}>
                                    #{a.appointmentid} - {new Date(a.appointmenttime).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Amount (Rs.) *</label>
                        <input
                            type="number"
                            value={formData.totalamount}
                            onChange={(e) => setFormData({ ...formData, totalamount: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            placeholder="5000"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                            <option value="Standard">Standard</option>
                            <option value="FBR">FBR (Tax Invoice)</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Payment Status</label>
                        <select
                            value={formData.paymentstatus}
                            onChange={(e) => setFormData({ ...formData, paymentstatus: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
