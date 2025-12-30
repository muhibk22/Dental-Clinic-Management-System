"use client";

import { useEffect, useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Activity, User } from 'lucide-react';
import Cookies from 'js-cookie';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import FormTextarea from '@/components/ui/FormTextarea';
import ActionButton from '@/components/ui/ActionButton';
import TableActions from '@/components/ui/TableActions';
import { getTreatments, getPatients, getAppointments, createTreatment, updateTreatment, deleteTreatment, Treatment, Patient, Appointment } from '@/lib/api';
import { treatmentStatusOptions } from '@/lib/constants';
import { useUserRole } from '@/components/admin/Sidebar';

// Get current user from cookie
const getCurrentUser = () => {
    try {
        const userStr = Cookies.get('dcms_user');
        if (userStr) return JSON.parse(userStr);
    } catch { }
    return null;
};

export default function TreatmentsPage() {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ patientid: '', name: '', description: '', status: 'Active' });

    const userRole = useUserRole();
    const isReadOnly = userRole === 'ASSISTANT';

    const currentUser = getCurrentUser();
    const isAssistant = currentUser?.role?.toUpperCase() === 'ASSISTANT';
    const assignedDoctorId = isAssistant && currentUser?.doctorid ? parseInt(currentUser.doctorid) : null;

    const fetchData = async () => {
        setLoading(true);
        const [treatRes, patRes, aptRes] = await Promise.all([getTreatments(), getPatients(), getAppointments()]);
        if (treatRes.data) setTreatments(treatRes.data);
        if (patRes.data) setPatients(patRes.data);
        if (aptRes.data) setAppointments(aptRes.data);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    // Filter treatments based on assigned doctor for assistants (via appointments linked to patients)
    const visibleTreatments = useMemo(() => {
        if (assignedDoctorId) {
            const patientIds = new Set(
                appointments
                    .filter(a => Number(a.doctorid) === assignedDoctorId)
                    .map(a => a.patientid)
            );
            return treatments.filter(t => patientIds.has(t.patientid));
        }
        return treatments;
    }, [treatments, appointments, assignedDoctorId]);

    const handleAddTreatment = () => {
        setSelectedTreatment(null);
        setFormData({ patientid: '', name: '', description: '', status: 'Active' });
        setError('');
        setModalOpen(true);
    };

    const handleEditTreatment = (treatment: Treatment) => {
        setSelectedTreatment(treatment);
        setFormData({
            patientid: String(treatment.patientid), name: treatment.name,
            description: treatment.description || '', status: treatment.status || 'Active',
        });
        setError('');
        setModalOpen(true);
    };

    const handleDeleteTreatment = async (treatment: Treatment) => {
        if (confirm(`Are you sure you want to delete treatment "${treatment.name}"?`)) {
            const result = await deleteTreatment(treatment.treatmentid);
            if (result.data) fetchData();
            if (result.error) alert(result.error);
        }
    };

    const handleSubmit = async () => {
        setError(''); setSaving(true);
        if (!formData.patientid || !formData.name) { setError('Patient and treatment name are required'); setSaving(false); return; }

        let result;
        if (selectedTreatment) {
            result = await updateTreatment(selectedTreatment.treatmentid, {
                patientid: Number(formData.patientid), name: formData.name,
                description: formData.description, status: formData.status,
            });
        } else {
            result = await createTreatment({
                patientid: Number(formData.patientid), name: formData.name,
                description: formData.description, status: formData.status,
            });
        }
        if (result.error) { setError(result.error); setSaving(false); return; }
        setModalOpen(false);
        fetchData();
        setSaving(false);
    };

    const getPatientName = (patientid: number) => patients.find(p => p.patientid === patientid)?.name || `Patient #${patientid}`;

    const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = { Active: 'info', Completed: 'success', Cancelled: 'danger' };
    const patientOptions = patients.map(p => ({ value: p.patientid, label: p.name }));

    const columns = [
        {
            key: 'name', label: 'Treatment', sortable: true, render: (t: Treatment) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center"><Activity size={18} className="text-white" /></div>
                    <div><p className="font-semibold text-slate-900">{t.name}</p><p className="text-sm text-slate-500 truncate max-w-[200px]">{t.description || 'No description'}</p></div>
                </div>
            )
        },
        { key: 'patientid', label: 'Patient', render: (t: Treatment) => <div className="flex items-center gap-2"><User size={16} className="text-slate-400" /><span>{getPatientName(t.patientid)}</span></div> },
        { key: 'status', label: 'Status', sortable: true, render: (t: Treatment) => <Badge variant={statusColors[t.status || 'Active'] || 'default'}>{t.status || 'Active'}</Badge> },
        { key: 'startdate', label: 'Start Date', sortable: true, render: (t: Treatment) => t.startdate ? new Date(t.startdate).toLocaleDateString() : '-' },
        ...(!isReadOnly ? [{
            key: 'actions', label: 'Actions', className: 'text-right', render: (t: Treatment) => (
                <TableActions>
                    <ActionButton icon={Edit2} onClick={() => handleEditTreatment(t)} variant="edit" title="Edit" />
                    <ActionButton icon={Trash2} onClick={() => handleDeleteTreatment(t)} variant="delete" title="Delete" />
                </TableActions>
            )
        }] : []),
    ];

    return (
        <DashboardLayout
            title="Treatments"
            subtitle={isReadOnly ? "View patient treatment plans (Read-only)" : "Manage patient treatment plans"}
            actions={!isReadOnly ? <Button onClick={handleAddTreatment} className="flex items-center gap-2"><Plus size={18} /> New Treatment</Button> : null}
        >
            <DataTable columns={columns} data={visibleTreatments} loading={loading} searchPlaceholder="Search treatments..." emptyMessage="No treatments found" />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedTreatment ? 'Edit Treatment' : 'Create New Treatment'} size="lg"
                footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : selectedTreatment ? 'Update' : 'Create Treatment'}</Button></>}>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
                <div className="space-y-4">
                    <FormSelect label="Patient" required value={formData.patientid} onChange={(e) => setFormData({ ...formData, patientid: e.target.value })} options={patientOptions} placeholder="Select patient" />
                    <FormField label="Treatment Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Root Canal, Braces, Whitening" />
                    <FormTextarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Treatment details..." />
                    <FormSelect label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={treatmentStatusOptions} placeholder="Select status" />
                </div>
            </Modal>
        </DashboardLayout>
    );
}
