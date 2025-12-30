"use client";

import { useEffect, useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, FileText, Calendar, Printer } from 'lucide-react';
import Cookies from 'js-cookie';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import { QuickStat, QuickStatsGrid } from '@/components/admin/QuickStats';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import FormSelect from '@/components/ui/FormSelect';
import FormTextarea from '@/components/ui/FormTextarea';
import ActionButton from '@/components/ui/ActionButton';
import TableActions from '@/components/ui/TableActions';
import { getPrescriptions, createPrescription, updatePrescription, deletePrescription, getAppointments, getPatients, getDoctors, Prescription, Appointment, Patient, Doctor } from '@/lib/api';
import { useUserRole, canEdit } from '@/components/admin/Sidebar';

// Get current user from cookie
const getCurrentUser = () => {
    try {
        const userStr = Cookies.get('dcms_user');
        if (userStr) return JSON.parse(userStr);
    } catch { }
    return null;
};

export default function PrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ appointmentid: '', notes: '' });

    const userRole = useUserRole();
    const canEditPrescriptions = canEdit(userRole, 'prescriptions');

    // Get assigned doctor for assistants
    const currentUser = getCurrentUser();
    const isAssistant = currentUser?.role?.toUpperCase() === 'ASSISTANT';
    const assignedDoctorId = isAssistant && currentUser?.doctorid ? parseInt(currentUser.doctorid) : null;

    const fetchData = async () => { setLoading(true); const [prescRes, aptRes, patRes, docRes] = await Promise.all([getPrescriptions(), getAppointments(), getPatients(), getDoctors()]); if (prescRes.data) setPrescriptions(prescRes.data); if (aptRes.data) setAppointments(aptRes.data); if (patRes.data) setPatients(patRes.data); if (docRes.data) setDoctors(docRes.data); setLoading(false); };

    useEffect(() => { fetchData(); }, []);

    // Filter appointments by assigned doctor for assistants
    const visibleAppointments = useMemo(() => {
        if (assignedDoctorId) {
            return appointments.filter(a => Number(a.doctorid) === assignedDoctorId);
        }
        return appointments;
    }, [appointments, assignedDoctorId]);

    // Filter prescriptions to only those linked to visible appointments
    const visiblePrescriptions = useMemo(() => {
        if (assignedDoctorId) {
            const visibleAptIds = new Set(visibleAppointments.map(a => a.appointmentid));
            return prescriptions.filter(p => visibleAptIds.has(p.appointmentid));
        }
        return prescriptions;
    }, [prescriptions, visibleAppointments, assignedDoctorId]);

    const getPatientFromAppointment = (appointmentid: number) => { const apt = appointments.find(a => a.appointmentid === appointmentid); return apt ? patients.find(p => p.patientid === apt.patientid) : null; };
    const getDoctorFromAppointment = (appointmentid: number) => { const apt = appointments.find(a => a.appointmentid === appointmentid); return apt ? doctors.find(d => d.doctorid === apt.doctorid) : null; };
    const getPatientName = (appointmentid: number) => getPatientFromAppointment(appointmentid)?.name || `Appointment #${appointmentid}`;

    const handleAddPrescription = () => { setSelectedPrescription(null); setFormData({ appointmentid: '', notes: '' }); setError(''); setModalOpen(true); };
    const handleEditPrescription = (p: Prescription) => { setSelectedPrescription(p); setFormData({ appointmentid: String(p.appointmentid), notes: p.notes || '' }); setError(''); setModalOpen(true); };
    const handlePrintPrescription = (p: Prescription) => { setSelectedPrescription(p); setPrintModalOpen(true); };

    const handlePrint = () => {
        if (!selectedPrescription) return;
        const patient = getPatientFromAppointment(selectedPrescription.appointmentid);
        const doctor = getDoctorFromAppointment(selectedPrescription.appointmentid);
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(`<!DOCTYPE html><html><head><title>Prescription RX-${String(selectedPrescription.prescriptionid).padStart(4, '0')}</title><style>body{font-family:Georgia,serif;padding:40px;}.header{text-align:center;border-bottom:3px double #0d9488;margin-bottom:25px;padding-bottom:20px;}.clinic-name{font-size:32px;font-weight:bold;color:#0d9488;}.rx{font-size:40px;color:#0d9488;font-style:italic;}</style></head><body><div class="header"><div class="clinic-name">ORADENT</div><div>Dental Clinic</div></div><p><strong>Patient:</strong> ${patient?.name || 'Patient'}</p><p><strong>Doctor:</strong> Dr. ${doctor?.name || 'Doctor'}</p><p><strong>Date:</strong> ${new Date(selectedPrescription.date).toLocaleDateString()}</p><div style="margin-top:30px;"><span class="rx">℞</span><pre style="margin-top:10px;">${selectedPrescription.notes || 'No notes'}</pre></div></body></html>`);
        printWindow.document.close(); printWindow.focus(); setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
        setPrintModalOpen(false);
    };

    const handleDeletePrescription = async (p: Prescription) => { if (confirm(`Delete Prescription #${p.prescriptionid}?`)) { const result = await deletePrescription(p.prescriptionid); if (result.data) fetchData(); } };

    const handleSubmit = async () => {
        setError(''); setSaving(true);
        if (!formData.appointmentid) { setError('Appointment is required'); setSaving(false); return; }

        let result;
        const isNew = !selectedPrescription;
        if (selectedPrescription) {
            result = await updatePrescription(selectedPrescription.prescriptionid, { appointmentid: parseInt(formData.appointmentid), notes: formData.notes || undefined });
        } else {
            result = await createPrescription({ appointmentid: parseInt(formData.appointmentid), date: new Date().toISOString(), notes: formData.notes || undefined });
        }
        if (result.error) { setError(result.error); setSaving(false); return; }
        setModalOpen(false); await fetchData(); setSaving(false);
        if (isNew && result.data) { setSelectedPrescription(result.data); setPrintModalOpen(true); }
    };

    const thisMonthCount = visiblePrescriptions.filter(p => { const d = new Date(p.date); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;

    const appointmentOptions = visibleAppointments.map(a => { const patient = patients.find(p => p.patientid === a.patientid); const doctor = doctors.find(d => d.doctorid === a.doctorid); return { value: a.appointmentid, label: `#${a.appointmentid} - ${patient?.name || 'Unknown'} (Dr. ${doctor?.name || 'Unknown'}) - ${new Date(a.appointmenttime).toLocaleDateString()}` }; });

    const columns = [
        { key: 'prescriptionid', label: 'Prescription #', sortable: true, render: (p: Prescription) => <div className="flex items-center gap-3"><div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><FileText size={18} className="text-purple-600" /></div><span className="font-semibold text-slate-900">RX-{String(p.prescriptionid).padStart(4, '0')}</span></div> },
        { key: 'appointmentid', label: 'Patient', render: (p: Prescription) => <span className="text-slate-700">{getPatientName(p.appointmentid)}</span> },
        { key: 'doctor', label: 'Doctor', render: (p: Prescription) => <span className="text-slate-600">Dr. {getDoctorFromAppointment(p.appointmentid)?.name || 'Unknown'}</span> },
        { key: 'date', label: 'Date', sortable: true, render: (p: Prescription) => <div className="flex items-center gap-2 text-slate-600"><Calendar size={16} />{new Date(p.date).toLocaleDateString()}</div> },
        { key: 'status', label: 'Status', render: () => <Badge variant="success">Issued</Badge> },
        {
            key: 'actions', label: 'Actions', className: 'text-right', render: (p: Prescription) => (
                <TableActions>
                    <ActionButton icon={Printer} onClick={() => handlePrintPrescription(p)} variant="print" title="Print" />
                    {canEditPrescriptions && <><ActionButton icon={Edit2} onClick={() => handleEditPrescription(p)} variant="edit" title="Edit" /><ActionButton icon={Trash2} onClick={() => handleDeletePrescription(p)} variant="delete" title="Delete" /></>}
                </TableActions>
            )
        },
    ];

    return (
        <DashboardLayout title="Prescriptions" subtitle={canEditPrescriptions ? "Manage patient prescriptions" : "View prescriptions (Read-only)"} actions={canEditPrescriptions ? <Button onClick={handleAddPrescription} className="flex items-center gap-2"><Plus size={18} /> New Prescription</Button> : null}>
            <QuickStatsGrid columns={2}><QuickStat label="Total Prescriptions" value={visiblePrescriptions.length} /><QuickStat label="This Month" value={thisMonthCount} color="purple" /></QuickStatsGrid>
            <DataTable columns={columns} data={visiblePrescriptions} loading={loading} searchPlaceholder="Search prescriptions..." emptyMessage="No prescriptions found" />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedPrescription ? 'Edit Prescription' : 'New Prescription'} size="lg" footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : selectedPrescription ? 'Update' : 'Create & Print'}</Button></>}>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
                <div className="space-y-4">
                    <FormSelect label="Appointment" required value={formData.appointmentid} onChange={(e) => setFormData({ ...formData, appointmentid: e.target.value })} options={appointmentOptions} placeholder="Select appointment" disabled={!!selectedPrescription} />
                    <FormTextarea label="Prescription Notes / Medicines" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={8} placeholder={`Example format:\n\n1. Amoxicillin 500mg\n   - 1 tablet 3 times daily\n   - After meals, for 5 days`} />
                </div>
            </Modal>
            <Modal isOpen={printModalOpen} onClose={() => setPrintModalOpen(false)} title="Print Prescription" size="lg" footer={<><Button variant="outline" onClick={() => setPrintModalOpen(false)}>Skip</Button><Button onClick={handlePrint} className="flex items-center gap-2"><Printer size={16} /> Print</Button></>}>
                <div className="bg-slate-50 p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4"><div><h2 className="text-2xl font-black"><span className="text-slate-900">Ora</span><span className="text-teal-500">Dent</span></h2><p className="text-xs text-slate-500">Dental Clinic</p></div><div className="text-right"><p className="text-lg font-bold text-slate-900">RX-{String(selectedPrescription?.prescriptionid || 0).padStart(4, '0')}</p><p className="text-sm text-slate-500">{selectedPrescription ? new Date(selectedPrescription.date).toLocaleDateString() : ''}</p></div></div>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm"><div><p className="text-slate-500">Patient</p><p className="font-semibold">{selectedPrescription ? getPatientName(selectedPrescription.appointmentid) : ''}</p></div><div className="text-right"><p className="text-slate-500">Doctor</p><p className="font-semibold">Dr. {selectedPrescription ? getDoctorFromAppointment(selectedPrescription.appointmentid)?.name || 'Unknown' : ''}</p></div></div>
                    <div className="border-t border-slate-200 pt-4"><p className="text-2xl text-teal-600 font-serif italic mb-2">℞</p><p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedPrescription?.notes || 'No prescription notes'}</p></div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
