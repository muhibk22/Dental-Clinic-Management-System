"use client";

import { useEffect, useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Receipt, User, CreditCard, Printer } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getBillings, createBilling, updateBilling, deleteBilling, getPatients, getAppointments, Billing, Patient, Appointment } from '@/lib/api';
import { useUserRole, canEdit } from '@/components/admin/Sidebar';

export default function BillingPage() {
    const [billings, setBillings] = useState<Billing[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        patientid: '',
        appointmentid: '',
        totalamount: '',
        type: 'Standard' as 'Standard' | 'FBR',
        paymentstatus: 'Pending',
    });

    const printRef = useRef<HTMLDivElement>(null);
    const userRole = useUserRole();
    const canEditBilling = canEdit(userRole, 'billing');

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

    const getPatientDetails = (patientid: number) => {
        return patients.find(p => p.patientid === patientid);
    };

    const handleAddInvoice = () => {
        setSelectedBilling(null);
        setFormData({
            patientid: '',
            appointmentid: '',
            totalamount: '',
            type: 'Standard',
            paymentstatus: 'Pending',
        });
        setError('');
        setModalOpen(true);
    };

    const handleEditInvoice = (billing: Billing) => {
        setSelectedBilling(billing);
        setFormData({
            patientid: String(billing.patientid),
            appointmentid: String(billing.appointmentid || ''),
            totalamount: String(billing.totalamount),
            type: billing.type,
            paymentstatus: billing.paymentstatus || 'Pending',
        });
        setError('');
        setModalOpen(true);
    };

    const handlePrintInvoice = (billing: Billing) => {
        setSelectedBilling(billing);
        setPrintModalOpen(true);
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const patient = selectedBilling ? getPatientDetails(selectedBilling.patientid) : null;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${selectedBilling?.billingid}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        padding: 40px;
                        color: #1e293b;
                    }
                    .invoice-header { 
                        display: flex; 
                        justify-content: space-between; 
                        align-items: flex-start;
                        border-bottom: 2px solid #0d9488;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .logo { 
                        font-size: 28px; 
                        font-weight: 900;
                        color: #0d9488;
                    }
                    .logo span { color: #1e293b; }
                    .clinic-info { text-align: right; font-size: 12px; color: #64748b; }
                    .invoice-title { 
                        font-size: 32px; 
                        font-weight: bold;
                        color: #1e293b;
                        margin-bottom: 5px;
                    }
                    .invoice-number { color: #64748b; font-size: 14px; }
                    .info-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 30px;
                        margin-bottom: 40px;
                    }
                    .info-box h3 { 
                        font-size: 12px; 
                        text-transform: uppercase; 
                        color: #64748b;
                        margin-bottom: 8px;
                        letter-spacing: 1px;
                    }
                    .info-box p { font-size: 14px; line-height: 1.6; }
                    .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .table th { 
                        background: #f1f5f9; 
                        padding: 12px 16px;
                        text-align: left;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        color: #64748b;
                        border-bottom: 2px solid #e2e8f0;
                    }
                    .table td { 
                        padding: 16px;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .total-row { 
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 30px;
                    }
                    .total-box {
                        background: #f1f5f9;
                        padding: 20px 30px;
                        border-radius: 8px;
                        text-align: right;
                    }
                    .total-label { font-size: 14px; color: #64748b; }
                    .total-amount { font-size: 28px; font-weight: bold; color: #0d9488; }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                    }
                    .status-paid { background: #dcfce7; color: #166534; }
                    .status-pending { background: #fef3c7; color: #92400e; }
                    .status-cancelled { background: #fee2e2; color: #991b1b; }
                    .footer { 
                        margin-top: 50px;
                        padding-top: 20px;
                        border-top: 1px solid #e2e8f0;
                        text-align: center;
                        font-size: 12px;
                        color: #64748b;
                    }
                    .fbr-notice {
                        background: #fef3c7;
                        border: 1px solid #f59e0b;
                        padding: 10px 15px;
                        border-radius: 6px;
                        font-size: 12px;
                        margin-bottom: 20px;
                    }
                    @media print {
                        body { padding: 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <div>
                        <div class="logo"><span>Ora</span>Dent</div>
                        <p style="color: #64748b; font-size: 12px; margin-top: 5px;">Dental Clinic Management System</p>
                    </div>
                    <div class="clinic-info">
                        <p><strong>OraDent Dental Clinic</strong></p>
                        <p>123 Healthcare Street</p>
                        <p>Lahore, Pakistan</p>
                        <p>Phone: +92 300 1234567</p>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <div>
                        <div class="invoice-title">INVOICE</div>
                        <div class="invoice-number">INV-${String(selectedBilling?.billingid || 0).padStart(4, '0')}</div>
                    </div>
                    <div style="text-align: right;">
                        <span class="status-badge status-${(selectedBilling?.paymentstatus || 'pending').toLowerCase()}">
                            ${selectedBilling?.paymentstatus || 'Pending'}
                        </span>
                    </div>
                </div>

                ${selectedBilling?.type === 'FBR' ? '<div class="fbr-notice">⚠️ This is an FBR Tax Invoice</div>' : ''}

                <div class="info-grid">
                    <div class="info-box">
                        <h3>Bill To</h3>
                        <p><strong>${patient?.name || 'Patient'}</strong></p>
                        <p>${patient?.phone || ''}</p>
                        <p>${patient?.address || ''}</p>
                    </div>
                    <div class="info-box" style="text-align: right;">
                        <h3>Invoice Details</h3>
                        <p><strong>Date:</strong> ${new Date(selectedBilling?.date || '').toLocaleDateString()}</p>
                        <p><strong>Type:</strong> ${selectedBilling?.type || 'Standard'}</p>
                        <p><strong>Appointment ID:</strong> ${selectedBilling?.appointmentid || 'N/A'}</p>
                    </div>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Dental Services</td>
                            <td style="text-align: right;">Rs. ${Number(selectedBilling?.totalamount || 0).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="total-row">
                    <div class="total-box">
                        <div class="total-label">Total Amount</div>
                        <div class="total-amount">Rs. ${Number(selectedBilling?.totalamount || 0).toLocaleString()}</div>
                    </div>
                </div>

                <div class="footer">
                    <p>Thank you for choosing OraDent Dental Clinic!</p>
                    <p style="margin-top: 5px;">For queries, contact: info@oradent.pk | +92 300 1234567</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);

        setPrintModalOpen(false);
    };

    const handleDeleteInvoice = async (billing: Billing) => {
        if (confirm(`Are you sure you want to delete Invoice #${billing.billingid}?`)) {
            const result = await deleteBilling(billing.billingid);
            if (result.data) {
                fetchData();
            }
        }
    };

    const handleSubmit = async () => {
        setError('');
        setSaving(true);

        if (!formData.patientid || !formData.totalamount) {
            setError('Patient and amount are required');
            setSaving(false);
            return;
        }

        let result;
        const isNewInvoice = !selectedBilling;

        if (selectedBilling) {
            result = await updateBilling(selectedBilling.billingid, {
                patientid: parseInt(formData.patientid),
                appointmentid: formData.appointmentid ? parseInt(formData.appointmentid) : 0,
                totalamount: parseFloat(formData.totalamount),
                type: formData.type,
                paymentstatus: formData.paymentstatus,
            });
        } else {
            result = await createBilling({
                patientid: parseInt(formData.patientid),
                appointmentid: formData.appointmentid ? parseInt(formData.appointmentid) : 0,
                totalamount: parseFloat(formData.totalamount),
                type: formData.type,
                paymentstatus: formData.paymentstatus,
                date: new Date().toISOString(),
            });
        }

        if (result.error) {
            setError(result.error);
            setSaving(false);
            return;
        }

        setModalOpen(false);
        await fetchData();
        setSaving(false);

        // Show print option after creating new invoice
        if (isNewInvoice && result.data) {
            setSelectedBilling(result.data);
            setPrintModalOpen(true);
        }
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
            render: (b: Billing) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrintInvoice(b); }}
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                        title="Print Invoice"
                    >
                        <Printer size={16} />
                    </button>
                    {canEditBilling && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleEditInvoice(b); }}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Edit Invoice"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteInvoice(b); }}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Invoice"
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout
            title="Billing"
            subtitle={canEditBilling ? "Manage invoices and payment records" : "View billing records (Read-only)"}
            actions={
                canEditBilling ? (
                    <Button onClick={handleAddInvoice} className="flex items-center gap-2">
                        <Plus size={18} /> Create Invoice
                    </Button>
                ) : null
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

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedBilling ? 'Edit Invoice' : 'Create Invoice'}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving ? 'Saving...' : selectedBilling ? 'Update Invoice' : 'Create Invoice'}
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Appointment (optional)</label>
                        <select
                            value={formData.appointmentid}
                            onChange={(e) => setFormData({ ...formData, appointmentid: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                            <option value="">Select appointment</option>
                            {appointments
                                .filter(a => {
                                    if (!formData.patientid) return true;
                                    return String(a.patientid) === formData.patientid;
                                })
                                .map(a => (
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
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Standard' | 'FBR' })}
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

            {/* Print Preview Modal */}
            <Modal
                isOpen={printModalOpen}
                onClose={() => setPrintModalOpen(false)}
                title="Print Invoice"
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setPrintModalOpen(false)}>Cancel</Button>
                        <Button onClick={handlePrint} className="flex items-center gap-2">
                            <Printer size={16} /> Print
                        </Button>
                    </>
                }
            >
                <div ref={printRef} className="bg-slate-50 p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black">
                                <span className="text-slate-900">Ora</span>
                                <span className="text-teal-500">Dent</span>
                            </h2>
                            <p className="text-sm text-slate-500">Dental Clinic</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">
                                INV-{String(selectedBilling?.billingid || 0).padStart(4, '0')}
                            </p>
                            <Badge variant={statusColors[selectedBilling?.paymentstatus || 'Pending'] || 'default'}>
                                {selectedBilling?.paymentstatus || 'Pending'}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                            <p className="text-slate-500">Patient</p>
                            <p className="font-semibold">{selectedBilling ? getPatientName(selectedBilling.patientid) : ''}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-500">Date</p>
                            <p className="font-semibold">{selectedBilling ? new Date(selectedBilling.date).toLocaleDateString() : ''}</p>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                        <div className="flex justify-between py-2">
                            <span className="text-slate-600">Dental Services</span>
                            <span className="font-semibold">Rs. {Number(selectedBilling?.totalamount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-3 border-t border-slate-300 font-bold text-lg">
                            <span>Total</span>
                            <span className="text-teal-600">Rs. {Number(selectedBilling?.totalamount || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
