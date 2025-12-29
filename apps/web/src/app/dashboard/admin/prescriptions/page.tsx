"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Calendar, Printer } from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    getPrescriptions, createPrescription, updatePrescription, deletePrescription,
    getAppointments, getPatients, getDoctors,
    Prescription, Appointment, Patient, Doctor
} from '@/lib/api';
import { useUserRole, canEdit } from '@/components/admin/Sidebar';

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
    const [formData, setFormData] = useState({
        appointmentid: '',
        notes: '',
    });

    const userRole = useUserRole();
    const canEditPrescriptions = canEdit(userRole, 'prescriptions');

    const fetchData = async () => {
        setLoading(true);
        const [prescRes, aptRes, patRes, docRes] = await Promise.all([
            getPrescriptions(),
            getAppointments(),
            getPatients(),
            getDoctors(),
        ]);
        if (prescRes.data) setPrescriptions(prescRes.data);
        if (aptRes.data) setAppointments(aptRes.data);
        if (patRes.data) setPatients(patRes.data);
        if (docRes.data) setDoctors(docRes.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getPatientFromAppointment = (appointmentid: number) => {
        const appointment = appointments.find(a => a.appointmentid === appointmentid);
        if (appointment) {
            return patients.find(p => p.patientid === appointment.patientid);
        }
        return null;
    };

    const getDoctorFromAppointment = (appointmentid: number) => {
        const appointment = appointments.find(a => a.appointmentid === appointmentid);
        if (appointment) {
            return doctors.find(d => d.doctorid === appointment.doctorid);
        }
        return null;
    };

    const getPatientName = (appointmentid: number) => {
        const patient = getPatientFromAppointment(appointmentid);
        return patient?.name || `Appointment #${appointmentid}`;
    };

    const handleAddPrescription = () => {
        setSelectedPrescription(null);
        setFormData({
            appointmentid: '',
            notes: '',
        });
        setError('');
        setModalOpen(true);
    };

    const handleEditPrescription = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        setFormData({
            appointmentid: String(prescription.appointmentid),
            notes: prescription.notes || '',
        });
        setError('');
        setModalOpen(true);
    };

    const handlePrintPrescription = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        setPrintModalOpen(true);
    };

    const handlePrint = () => {
        if (!selectedPrescription) return;

        const patient = getPatientFromAppointment(selectedPrescription.appointmentid);
        const doctor = getDoctorFromAppointment(selectedPrescription.appointmentid);

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Prescription RX-${String(selectedPrescription.prescriptionid).padStart(4, '0')}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Georgia', 'Times New Roman', serif; 
                        padding: 40px;
                        color: #1e293b;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px double #0d9488;
                        padding-bottom: 20px;
                        margin-bottom: 25px;
                    }
                    .clinic-name {
                        font-size: 32px;
                        font-weight: bold;
                        color: #0d9488;
                        letter-spacing: 2px;
                    }
                    .clinic-tagline {
                        font-size: 12px;
                        color: #64748b;
                        margin-top: 5px;
                        letter-spacing: 1px;
                    }
                    .clinic-contact {
                        font-size: 11px;
                        color: #64748b;
                        margin-top: 10px;
                    }
                    .rx-symbol {
                        font-size: 48px;
                        font-weight: bold;
                        color: #0d9488;
                        position: absolute;
                        left: 40px;
                        top: 150px;
                        font-family: serif;
                    }
                    .prescription-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 25px;
                        font-size: 13px;
                    }
                    .patient-info {
                        background: #f8fafc;
                        padding: 15px 20px;
                        border-radius: 8px;
                        border-left: 4px solid #0d9488;
                    }
                    .patient-info h4 {
                        font-size: 11px;
                        text-transform: uppercase;
                        color: #64748b;
                        margin-bottom: 8px;
                        letter-spacing: 1px;
                    }
                    .patient-name {
                        font-size: 18px;
                        font-weight: bold;
                        color: #1e293b;
                    }
                    .date-info {
                        text-align: right;
                    }
                    .prescription-body {
                        min-height: 300px;
                        padding: 30px;
                        padding-left: 80px;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        margin-bottom: 30px;
                        position: relative;
                    }
                    .rx-large {
                        position: absolute;
                        left: 20px;
                        top: 20px;
                        font-size: 40px;
                        font-weight: bold;
                        color: #0d9488;
                        font-family: serif;
                        font-style: italic;
                    }
                    .prescription-content {
                        font-size: 14px;
                        line-height: 1.8;
                        white-space: pre-wrap;
                    }
                    .doctor-section {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        margin-top: 40px;
                    }
                    .doctor-info {
                        text-align: right;
                    }
                    .doctor-name {
                        font-size: 16px;
                        font-weight: bold;
                        color: #1e293b;
                    }
                    .doctor-specialization {
                        font-size: 12px;
                        color: #64748b;
                    }
                    .signature-line {
                        width: 200px;
                        border-top: 1px solid #1e293b;
                        margin-top: 40px;
                        padding-top: 5px;
                        font-size: 11px;
                        color: #64748b;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 15px;
                        border-top: 1px solid #e2e8f0;
                        text-align: center;
                        font-size: 10px;
                        color: #94a3b8;
                    }
                    .prescription-id {
                        background: #f1f5f9;
                        padding: 5px 15px;
                        border-radius: 20px;
                        font-size: 11px;
                        color: #64748b;
                        display: inline-block;
                    }
                    @media print {
                        body { padding: 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="clinic-name">ORADENT</div>
                    <div class="clinic-tagline">Dental Clinic & Care Center</div>
                    <div class="clinic-contact">
                        123 Healthcare Street, Lahore, Pakistan | Phone: +92 300 1234567 | Email: info@oradent.pk
                    </div>
                </div>

                <div class="prescription-info">
                    <div class="patient-info">
                        <h4>Patient</h4>
                        <div class="patient-name">${patient?.name || 'Patient'}</div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                            ${patient?.phone || ''} ${patient?.gender ? '| ' + patient.gender : ''}
                        </div>
                    </div>
                    <div class="date-info">
                        <span class="prescription-id">RX-${String(selectedPrescription.prescriptionid).padStart(4, '0')}</span>
                        <div style="margin-top: 10px; font-size: 13px;">
                            <strong>Date:</strong> ${new Date(selectedPrescription.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
                        </div>
                    </div>
                </div>

                <div class="prescription-body">
                    <div class="rx-large">℞</div>
                    <div class="prescription-content">
${selectedPrescription.notes || 'No prescription notes provided.'}
                    </div>
                </div>

                <div class="doctor-section">
                    <div style="font-size: 11px; color: #64748b;">
                        <p>⚠️ This prescription is valid for 30 days from the date of issue.</p>
                        <p>Please consult your doctor before taking any medication.</p>
                    </div>
                    <div class="doctor-info">
                        <div class="doctor-name">Dr. ${doctor?.name || 'Doctor'}</div>
                        <div class="doctor-specialization">${doctor?.specialization || 'Dental Surgeon'}</div>
                        <div class="signature-line">Signature</div>
                    </div>
                </div>

                <div class="footer">
                    <p>Thank you for choosing OraDent Dental Clinic | www.oradent.pk</p>
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

    const handleDeletePrescription = async (prescription: Prescription) => {
        if (confirm(`Are you sure you want to delete Prescription #${prescription.prescriptionid}?`)) {
            const result = await deletePrescription(prescription.prescriptionid);
            if (result.data) {
                fetchData();
            }
        }
    };

    const handleSubmit = async () => {
        setError('');
        setSaving(true);

        if (!formData.appointmentid) {
            setError('Appointment is required');
            setSaving(false);
            return;
        }

        let result;
        const isNew = !selectedPrescription;

        if (selectedPrescription) {
            result = await updatePrescription(selectedPrescription.prescriptionid, {
                appointmentid: parseInt(formData.appointmentid),
                notes: formData.notes || undefined,
            });
        } else {
            result = await createPrescription({
                appointmentid: parseInt(formData.appointmentid),
                date: new Date().toISOString(),
                notes: formData.notes || undefined,
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

        // Prompt to print after creating new prescription
        if (isNew && result.data) {
            setSelectedPrescription(result.data);
            setPrintModalOpen(true);
        }
    };

    const columns = [
        {
            key: 'prescriptionid',
            label: 'Prescription #',
            sortable: true,
            render: (p: Prescription) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FileText size={18} className="text-purple-600" />
                    </div>
                    <span className="font-semibold text-slate-900">RX-{String(p.prescriptionid).padStart(4, '0')}</span>
                </div>
            ),
        },
        {
            key: 'appointmentid',
            label: 'Patient',
            render: (p: Prescription) => (
                <span className="text-slate-700">{getPatientName(p.appointmentid)}</span>
            ),
        },
        {
            key: 'doctor',
            label: 'Doctor',
            render: (p: Prescription) => {
                const doctor = getDoctorFromAppointment(p.appointmentid);
                return (
                    <span className="text-slate-600">Dr. {doctor?.name || 'Unknown'}</span>
                );
            },
        },
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (p: Prescription) => (
                <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={16} />
                    {new Date(p.date).toLocaleDateString()}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: () => (
                <Badge variant="success">Issued</Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: (p: Prescription) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrintPrescription(p); }}
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                        title="Print Prescription"
                    >
                        <Printer size={16} />
                    </button>
                    {canEditPrescriptions && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleEditPrescription(p); }}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeletePrescription(p); }}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete"
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
            title="Prescriptions"
            subtitle={canEditPrescriptions ? "Manage patient prescriptions" : "View prescriptions (Read-only)"}
            actions={
                canEditPrescriptions ? (
                    <Button onClick={handleAddPrescription} className="flex items-center gap-2">
                        <Plus size={18} /> New Prescription
                    </Button>
                ) : null
            }
        >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Total Prescriptions</p>
                    <p className="text-2xl font-bold text-slate-900">{prescriptions.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">This Month</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {prescriptions.filter(p => {
                            const pDate = new Date(p.date);
                            const now = new Date();
                            return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
                        }).length}
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={prescriptions}
                loading={loading}
                searchPlaceholder="Search prescriptions..."
                emptyMessage="No prescriptions found"
            />

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedPrescription ? 'Edit Prescription' : 'New Prescription'}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving ? 'Saving...' : selectedPrescription ? 'Update' : 'Create & Print'}
                        </Button>
                    </>
                }
            >
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Appointment *</label>
                        <select
                            value={formData.appointmentid}
                            onChange={(e) => setFormData({ ...formData, appointmentid: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            disabled={!!selectedPrescription}
                        >
                            <option value="">Select appointment</option>
                            {appointments.map(a => {
                                const patient = patients.find(p => p.patientid === a.patientid);
                                const doctor = doctors.find(d => d.doctorid === a.doctorid);
                                return (
                                    <option key={a.appointmentid} value={a.appointmentid}>
                                        #{a.appointmentid} - {patient?.name || 'Unknown'} (Dr. {doctor?.name || 'Unknown'}) - {new Date(a.appointmenttime).toLocaleDateString()}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Prescription Notes / Medicines</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 min-h-[180px] font-mono text-sm"
                            placeholder={`Example format:

1. Amoxicillin 500mg
   - 1 tablet 3 times daily
   - After meals, for 5 days

2. Ibuprofen 400mg
   - 1 tablet as needed for pain
   - Maximum 3 times daily

Special Instructions:
- Complete the full course of antibiotics
- Avoid hot foods for 24 hours`}
                        />
                    </div>
                </div>
            </Modal>

            {/* Print Preview Modal */}
            <Modal
                isOpen={printModalOpen}
                onClose={() => setPrintModalOpen(false)}
                title="Print Prescription"
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setPrintModalOpen(false)}>Skip</Button>
                        <Button onClick={handlePrint} className="flex items-center gap-2">
                            <Printer size={16} /> Print
                        </Button>
                    </>
                }
            >
                <div className="bg-slate-50 p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-black">
                                <span className="text-slate-900">Ora</span>
                                <span className="text-teal-500">Dent</span>
                            </h2>
                            <p className="text-xs text-slate-500">Dental Clinic</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-slate-900">
                                RX-{String(selectedPrescription?.prescriptionid || 0).padStart(4, '0')}
                            </p>
                            <p className="text-sm text-slate-500">
                                {selectedPrescription ? new Date(selectedPrescription.date).toLocaleDateString() : ''}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                            <p className="text-slate-500">Patient</p>
                            <p className="font-semibold">
                                {selectedPrescription ? getPatientName(selectedPrescription.appointmentid) : ''}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-500">Doctor</p>
                            <p className="font-semibold">
                                Dr. {selectedPrescription ? getDoctorFromAppointment(selectedPrescription.appointmentid)?.name || 'Unknown' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                        <p className="text-2xl text-teal-600 font-serif italic mb-2">℞</p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
                            {selectedPrescription?.notes || 'No prescription notes'}
                        </p>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
