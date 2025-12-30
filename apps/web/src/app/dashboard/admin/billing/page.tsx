"use client";

import { useEffect, useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Receipt, User, CreditCard, Printer } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import { QuickStat, QuickStatsGrid } from '@/components/admin/QuickStats';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import ActionButton from '@/components/ui/ActionButton';
import TableActions from '@/components/ui/TableActions';
import { getBillings, createBilling, updateBilling, deleteBilling, getPatients, getAppointments, Billing, Patient, Appointment } from '@/lib/api';
import { useUserRole, canEdit } from '@/components/admin/Sidebar';
import { paymentStatusOptions, invoiceTypeOptions } from '@/lib/constants';

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
    const [formData, setFormData] = useState({ patientid: '', appointmentid: '', totalamount: '', type: 'Standard' as 'Standard' | 'FBR', paymentstatus: 'Pending' });

    const printRef = useRef<HTMLDivElement>(null);
    const userRole = useUserRole();
    const canEditBilling = canEdit(userRole, 'billing');

    const fetchData = async () => { setLoading(true); const [billRes, patRes, aptRes] = await Promise.all([getBillings(), getPatients(), getAppointments()]); if (billRes.data) setBillings(billRes.data); if (patRes.data) setPatients(patRes.data); if (aptRes.data) setAppointments(aptRes.data); setLoading(false); };

    useEffect(() => { fetchData(); }, []);

    const getPatientName = (patientid: number) => patients.find(p => p.patientid === patientid)?.name || `Patient #${patientid}`;
    const getPatientDetails = (patientid: number) => patients.find(p => p.patientid === patientid);

    const handleAddInvoice = () => { setSelectedBilling(null); setFormData({ patientid: '', appointmentid: '', totalamount: '', type: 'Standard', paymentstatus: 'Pending' }); setError(''); setModalOpen(true); };
    const handleEditInvoice = (billing: Billing) => { setSelectedBilling(billing); setFormData({ patientid: String(billing.patientid), appointmentid: String(billing.appointmentid || ''), totalamount: String(billing.totalamount), type: billing.type, paymentstatus: billing.paymentstatus || 'Pending' }); setError(''); setModalOpen(true); };
    const handlePrintInvoice = (billing: Billing) => { setSelectedBilling(billing); setPrintModalOpen(true); };

    const handlePrint = () => {
        if (!selectedBilling) return;
        const patient = getPatientDetails(selectedBilling.patientid);
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(`<!DOCTYPE html><html><head><title>Invoice #${selectedBilling.billingid}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',sans-serif;padding:40px;color:#1e293b;}.header{display:flex;justify-content:space-between;border-bottom:2px solid #0d9488;padding-bottom:20px;margin-bottom:30px;}.logo{font-size:28px;font-weight:900;color:#0d9488;}.total-amount{font-size:28px;font-weight:bold;color:#0d9488;}</style></head><body><div class="header"><div class="logo">FDC</div><div>Invoice #${selectedBilling.billingid}</div></div><p><strong>Patient:</strong> ${patient?.name || 'Patient'}</p><p><strong>Date:</strong> ${new Date(selectedBilling.date).toLocaleDateString()}</p><p><strong>Amount:</strong> Rs. ${Number(selectedBilling.totalamount).toLocaleString()}</p><p><strong>Status:</strong> ${selectedBilling.paymentstatus}</p></body></html>`);
        printWindow.document.close(); printWindow.focus(); setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
        setPrintModalOpen(false);
    };

    const handleDeleteInvoice = async (billing: Billing) => { if (confirm(`Are you sure you want to delete Invoice #${billing.billingid}?`)) { const result = await deleteBilling(billing.billingid); if (result.data) fetchData(); } };

    const handleSubmit = async () => {
        setError(''); setSaving(true);
        if (!formData.patientid || !formData.totalamount) { setError('Patient and amount are required'); setSaving(false); return; }

        let result;
        const isNew = !selectedBilling;
        if (selectedBilling) {
            result = await updateBilling(selectedBilling.billingid, { patientid: parseInt(formData.patientid), appointmentid: formData.appointmentid ? parseInt(formData.appointmentid) : 0, totalamount: parseFloat(formData.totalamount), type: formData.type, paymentstatus: formData.paymentstatus });
        } else {
            result = await createBilling({ patientid: parseInt(formData.patientid), appointmentid: formData.appointmentid ? parseInt(formData.appointmentid) : 0, totalamount: parseFloat(formData.totalamount), type: formData.type, paymentstatus: formData.paymentstatus, date: new Date().toISOString() });
        }
        if (result.error) { setError(result.error); setSaving(false); return; }
        setModalOpen(false); await fetchData(); setSaving(false);
        if (isNew && result.data) { setSelectedBilling(result.data); setPrintModalOpen(true); }
    };

    const totalRevenue = billings.filter(b => b.paymentstatus === 'Paid' || b.paymentstatus === 'PAID').reduce((sum, b) => sum + Number(b.totalamount), 0);
    const pendingAmount = billings.filter(b => b.paymentstatus === 'Pending' || b.paymentstatus === 'PENDING').reduce((sum, b) => sum + Number(b.totalamount), 0);

    const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = { Paid: 'success', PAID: 'success', Pending: 'warning', PENDING: 'warning', Cancelled: 'danger', CANCELLED: 'danger' };
    const patientOptions = patients.map(p => ({ value: p.patientid, label: p.name }));
    const filteredAppointments = appointments.filter(a => !formData.patientid || String(a.patientid) === formData.patientid);
    const appointmentOptions = filteredAppointments.map(a => ({ value: a.appointmentid, label: `#${a.appointmentid} - ${new Date(a.appointmenttime).toLocaleDateString()}` }));

    const columns = [
        { key: 'billingid', label: 'Invoice #', sortable: true, render: (b: Billing) => <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Receipt size={18} className="text-blue-600" /></div><span className="font-semibold text-slate-900">INV-{String(b.billingid).padStart(4, '0')}</span></div> },
        { key: 'patientid', label: 'Patient', render: (b: Billing) => <div className="flex items-center gap-2"><User size={16} className="text-slate-400" /><span>{getPatientName(b.patientid)}</span></div> },
        { key: 'totalamount', label: 'Amount', sortable: true, render: (b: Billing) => <span className="font-bold text-slate-900">Rs. {Number(b.totalamount).toLocaleString()}</span> },
        { key: 'type', label: 'Type', render: (b: Billing) => <div className="flex items-center gap-2"><CreditCard size={16} className="text-slate-400" /><span>{b.type}</span></div> },
        { key: 'paymentstatus', label: 'Status', sortable: true, render: (b: Billing) => <Badge variant={statusColors[b.paymentstatus || 'Pending'] || 'default'}>{b.paymentstatus || 'Pending'}</Badge> },
        { key: 'date', label: 'Date', sortable: true, render: (b: Billing) => new Date(b.date).toLocaleDateString() },
        {
            key: 'actions', label: 'Actions', className: 'text-right', render: (b: Billing) => (
                <TableActions>
                    <ActionButton icon={Printer} onClick={() => handlePrintInvoice(b)} variant="print" title="Print" />
                    {canEditBilling && <><ActionButton icon={Edit2} onClick={() => handleEditInvoice(b)} variant="edit" title="Edit" /><ActionButton icon={Trash2} onClick={() => handleDeleteInvoice(b)} variant="delete" title="Delete" /></>}
                </TableActions>
            )
        },
    ];

    return (
        <DashboardLayout title="Billing" subtitle={canEditBilling ? "Manage invoices and payment records" : "View billing records (Read-only)"} actions={canEditBilling ? <Button onClick={handleAddInvoice} className="flex items-center gap-2"><Plus size={18} /> Create Invoice</Button> : null}>
            <QuickStatsGrid columns={3}><QuickStat label="Total Invoices" value={billings.length} /><QuickStat label="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} color="green" /><QuickStat label="Pending Payments" value={`Rs. ${pendingAmount.toLocaleString()}`} color="yellow" /></QuickStatsGrid>
            <DataTable columns={columns} data={billings} loading={loading} searchPlaceholder="Search invoices..." emptyMessage="No billing records found" />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedBilling ? 'Edit Invoice' : 'Create Invoice'} size="lg" footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : selectedBilling ? 'Update Invoice' : 'Create Invoice'}</Button></>}>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect label="Patient" required value={formData.patientid} onChange={(e) => setFormData({ ...formData, patientid: e.target.value })} options={patientOptions} placeholder="Select patient" />
                    <FormSelect label="Appointment (optional)" value={formData.appointmentid} onChange={(e) => setFormData({ ...formData, appointmentid: e.target.value })} options={appointmentOptions} placeholder="Select appointment" />
                    <FormField label="Amount (Rs.)" required type="number" value={formData.totalamount} onChange={(e) => setFormData({ ...formData, totalamount: e.target.value })} placeholder="5000" min={0} />
                    <FormSelect label="Invoice Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Standard' | 'FBR' })} options={invoiceTypeOptions} placeholder="Select type" />
                    <FormSelect label="Payment Status" className="md:col-span-2" value={formData.paymentstatus} onChange={(e) => setFormData({ ...formData, paymentstatus: e.target.value })} options={paymentStatusOptions} placeholder="Select status" />
                </div>
            </Modal>
            <Modal isOpen={printModalOpen} onClose={() => setPrintModalOpen(false)} title="Print Invoice" size="lg" footer={<><Button variant="outline" onClick={() => setPrintModalOpen(false)}>Cancel</Button><Button onClick={handlePrint} className="flex items-center gap-2"><Printer size={16} /> Print</Button></>}>
                <div ref={printRef} className="bg-slate-50 p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-6"><div><h2 className="text-2xl font-black"><span className="text-teal-500">FDC</span></h2><p className="text-sm text-slate-500">Dental Clinic</p></div><div className="text-right"><p className="text-xl font-bold text-slate-900">INV-{String(selectedBilling?.billingid || 0).padStart(4, '0')}</p><Badge variant={statusColors[selectedBilling?.paymentstatus || 'Pending'] || 'default'}>{selectedBilling?.paymentstatus || 'Pending'}</Badge></div></div>
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm"><div><p className="text-slate-500">Patient</p><p className="font-semibold">{selectedBilling ? getPatientName(selectedBilling.patientid) : ''}</p></div><div className="text-right"><p className="text-slate-500">Date</p><p className="font-semibold">{selectedBilling ? new Date(selectedBilling.date).toLocaleDateString() : ''}</p></div></div>
                    <div className="border-t border-slate-200 pt-4"><div className="flex justify-between py-2"><span className="text-slate-600">Dental Services</span><span className="font-semibold">Rs. {Number(selectedBilling?.totalamount || 0).toLocaleString()}</span></div><div className="flex justify-between py-3 border-t border-slate-300 font-bold text-lg"><span>Total</span><span className="text-teal-600">Rs. {Number(selectedBilling?.totalamount || 0).toLocaleString()}</span></div></div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
