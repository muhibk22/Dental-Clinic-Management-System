"use client";

import { useEffect, useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Clock, User, Stethoscope, Calendar, ChevronLeft, ChevronRight, Filter, CalendarDays, CalendarClock, CheckCircle2, XCircle, AlertCircle, X, AlertTriangle } from 'lucide-react';
import Cookies from 'js-cookie';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import FormSelect from '@/components/ui/FormSelect';
import FormTextarea from '@/components/ui/FormTextarea';
import FormField from '@/components/ui/FormField';
import ActionButton from '@/components/ui/ActionButton';
import TableActions from '@/components/ui/TableActions';
import { getAppointments, getPatients, getDoctors, createAppointment, updateAppointment, deleteAppointment, Appointment, Patient, Doctor } from '@/lib/api';

type StatusFilter = 'all' | 'Scheduled' | 'Completed' | 'Cancelled' | 'Missed';

// Get current user from cookie
const getCurrentUser = () => {
    try {
        const userStr = Cookies.get('dcms_user');
        if (userStr) return JSON.parse(userStr);
    } catch { }
    return null;
};

// Helper to determine effective status (marks past appointments as Missed)
const getEffectiveStatus = (apt: Appointment): string => {
    const now = new Date();
    const aptTime = new Date(apt.appointmenttime);
    const status = apt.status || 'Scheduled';

    // If appointment time has passed and it's still "Scheduled", mark as Missed
    if (aptTime < now && status === 'Scheduled') {
        return 'Missed';
    }
    return status;
};

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ patientid: '', doctorid: '', appointmenttime: '', notes: '', status: 'Scheduled' });

    // UI State
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

    // Get current user info
    const currentUser = getCurrentUser();
    const isDoctor = currentUser?.role?.toUpperCase() === 'DOCTOR';
    const isAssistant = currentUser?.role?.toUpperCase() === 'ASSISTANT';
    const shouldFilterByDoctor = isDoctor || isAssistant;

    // Get doctorid from user cookie (set at login for doctor and assistant users)
    const currentDoctorId = shouldFilterByDoctor && currentUser?.doctorid
        ? parseInt(currentUser.doctorid)
        : null;

    const fetchData = async () => {
        setLoading(true);
        const [aptRes, patRes, docRes] = await Promise.all([
            getAppointments(),
            getPatients(),
            getDoctors()
        ]);
        if (aptRes.data) setAppointments(aptRes.data);
        if (patRes.data) setPatients(patRes.data);
        if (docRes.data) setDoctors(docRes.data);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    // Filter appointments for doctors and assistants (they only see their assigned doctor's appointments)
    const visibleAppointments = useMemo(() => {
        if (shouldFilterByDoctor && currentDoctorId) {
            return appointments.filter(a => {
                const aptDoctorId = typeof a.doctorid === 'string' ? parseInt(a.doctorid) : Number(a.doctorid);
                return aptDoctorId === currentDoctorId;
            });
        }
        return appointments;
    }, [appointments, shouldFilterByDoctor, currentDoctorId]);

    // Stats calculations (use visibleAppointments instead of all appointments)
    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);

        return {
            today: visibleAppointments.filter(a => {
                const d = new Date(a.appointmenttime);
                return d >= today && d < tomorrow;
            }).length,
            thisWeek: visibleAppointments.filter(a => {
                const d = new Date(a.appointmenttime);
                return d >= today && d < weekEnd;
            }).length,
            scheduled: visibleAppointments.filter(a => getEffectiveStatus(a) === 'Scheduled').length,
            completed: visibleAppointments.filter(a => a.status === 'Completed').length,
            cancelled: visibleAppointments.filter(a => a.status === 'Cancelled').length,
            missed: visibleAppointments.filter(a => getEffectiveStatus(a) === 'Missed').length,
        };
    }, [visibleAppointments]);

    // Filtered appointments
    const filteredAppointments = useMemo(() => {
        let filtered = [...visibleAppointments];

        // Filter by calendar date if selected
        if (selectedCalendarDate) {
            filtered = filtered.filter(a => {
                const d = new Date(a.appointmenttime);
                return d.toDateString() === selectedCalendarDate.toDateString();
            });
        }

        // Filter by status (including effective "Missed" status)
        if (statusFilter !== 'all') {
            filtered = filtered.filter(a => getEffectiveStatus(a) === statusFilter);
        }

        // Sort by date (newest first for all, ascending for selected date)
        filtered.sort((a, b) => {
            if (selectedCalendarDate) {
                return new Date(a.appointmenttime).getTime() - new Date(b.appointmenttime).getTime();
            }
            return new Date(b.appointmenttime).getTime() - new Date(a.appointmenttime).getTime();
        });

        return filtered;
    }, [visibleAppointments, statusFilter, selectedCalendarDate]);

    // Today's appointments for timeline
    const todayAppointments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return visibleAppointments
            .filter(a => {
                const d = new Date(a.appointmenttime);
                return d >= today && d < tomorrow;
            })
            .sort((a, b) => new Date(a.appointmenttime).getTime() - new Date(b.appointmenttime).getTime());
    }, [visibleAppointments]);

    // Calendar helpers
    const calendarDays = useMemo(() => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const days: (Date | null)[] = [];

        for (let i = 0; i < startPadding; i++) days.push(null);
        for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));

        return days;
    }, [selectedDate]);

    const getAppointmentsForDate = (date: Date) => {
        return visibleAppointments.filter(a => {
            const d = new Date(a.appointmenttime);
            return d.toDateString() === date.toDateString();
        });
    };

    // Validation: Check if doctor has conflicting appointment (within 10 minutes)
    const checkDoctorConflict = (doctorid: string, appointmenttime: string, excludeId?: number): string | null => {
        if (!doctorid || !appointmenttime) return null;

        const newTime = new Date(appointmenttime).getTime();
        const TEN_MINUTES = 10 * 60 * 1000;

        for (const apt of appointments) {
            if (excludeId && apt.appointmentid === excludeId) continue;
            if (String(apt.doctorid) !== doctorid) continue;

            const existingTime = new Date(apt.appointmenttime).getTime();
            const diff = Math.abs(newTime - existingTime);

            if (diff < TEN_MINUTES) {
                const doctor = doctors.find(d => d.doctorid === apt.doctorid);
                const conflictTime = new Date(apt.appointmenttime).toLocaleString();
                return `Dr. ${doctor?.name || 'Doctor'} already has an appointment at ${conflictTime}. Please select a time at least 10 minutes apart.`;
            }
        }
        return null;
    };

    // Validation: Check if appointment time is in the future
    const checkFutureTime = (appointmenttime: string): string | null => {
        if (!appointmenttime) return null;

        const aptTime = new Date(appointmenttime);
        const now = new Date();

        if (aptTime <= now) {
            return 'Appointment must be scheduled for a future date and time.';
        }
        return null;
    };

    const handleAddAppointment = () => {
        setSelectedAppointment(null);
        setFormData({ patientid: '', doctorid: currentDoctorId ? String(currentDoctorId) : '', appointmenttime: '', notes: '', status: 'Scheduled' });
        setError('');
        setModalOpen(true);
    };

    const handleEditAppointment = (apt: Appointment) => {
        setSelectedAppointment(apt);
        const datetime = apt.appointmenttime ? new Date(apt.appointmenttime).toISOString().slice(0, 16) : '';
        setFormData({
            patientid: String(apt.patientid), doctorid: String(apt.doctorid),
            appointmenttime: datetime, notes: apt.notes || '', status: apt.status || 'Scheduled',
        });
        setError('');
        setModalOpen(true);
    };

    const handleDeleteAppointment = async (apt: Appointment) => {
        if (confirm(`Are you sure you want to delete this appointment?`)) {
            const result = await deleteAppointment(apt.appointmentid);
            if (result.data) fetchData();
            if (result.error) alert(result.error);
        }
    };

    const handleCalendarDateClick = (date: Date) => {
        if (selectedCalendarDate?.toDateString() === date.toDateString()) {
            setSelectedCalendarDate(null); // Deselect if same date clicked
        } else {
            setSelectedCalendarDate(date);
        }
    };

    const handleSubmit = async () => {
        setError(''); setSaving(true);

        // Basic validation
        if (!formData.patientid || !formData.doctorid || !formData.appointmenttime) {
            setError('Patient, doctor, and appointment time are required');
            setSaving(false); return;
        }

        // Future time validation (only for new appointments)
        if (!selectedAppointment) {
            const futureError = checkFutureTime(formData.appointmenttime);
            if (futureError) {
                setError(futureError);
                setSaving(false); return;
            }
        }

        // Doctor conflict validation
        const conflictError = checkDoctorConflict(
            formData.doctorid,
            formData.appointmenttime,
            selectedAppointment?.appointmentid
        );
        if (conflictError) {
            setError(conflictError);
            setSaving(false); return;
        }

        let result;
        if (selectedAppointment) {
            result = await updateAppointment(selectedAppointment.appointmentid, {
                patientid: Number(formData.patientid), doctorid: Number(formData.doctorid),
                appointmenttime: formData.appointmenttime, notes: formData.notes,
                status: formData.status,
            });
        } else {
            result = await createAppointment({
                patientid: Number(formData.patientid), doctorid: Number(formData.doctorid),
                appointmenttime: formData.appointmenttime, notes: formData.notes,
            });
        }
        if (result.error) { setError(result.error); setSaving(false); return; }
        setModalOpen(false);
        fetchData();
        setSaving(false);
    };

    const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'purple'> = {
        Scheduled: 'info',
        Completed: 'success',
        Cancelled: 'danger',
        Missed: 'warning'
    };
    const patientOptions = patients.map(p => ({ value: p.patientid, label: p.name }));
    const doctorOptions = doctors
        .filter(d => !currentDoctorId || d.doctorid === currentDoctorId)
        .map(d => ({ value: d.doctorid, label: d.name }));
    const statusOptions = [
        { value: 'Scheduled', label: 'Scheduled' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' },
    ];

    const formatTime = (date: string) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Get minimum datetime for the form input (now + 1 minute)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1);
        return now.toISOString().slice(0, 16);
    };

    return (
        <DashboardLayout
            title="Appointments"
            subtitle="Manage patient appointments and schedules"
            actions={<Button onClick={handleAddAppointment} className="flex items-center gap-2"><Plus size={18} /> Book Appointment</Button>}
        >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
                    <div className="flex items-center gap-2 mb-2 text-blue-100"><CalendarDays size={18} /><span className="text-sm">Today</span></div>
                    <p className="text-3xl font-black">{stats.today}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
                    <div className="flex items-center gap-2 mb-2 text-purple-100"><CalendarClock size={18} /><span className="text-sm">This Week</span></div>
                    <p className="text-3xl font-black">{stats.thisWeek}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 text-blue-600"><AlertCircle size={18} /><span className="text-sm text-slate-500">Scheduled</span></div>
                    <p className="text-3xl font-black text-slate-900">{stats.scheduled}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 text-green-600"><CheckCircle2 size={18} /><span className="text-sm text-slate-500">Completed</span></div>
                    <p className="text-3xl font-black text-slate-900">{stats.completed}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 text-yellow-600"><AlertTriangle size={18} /><span className="text-sm text-slate-500">Missed</span></div>
                    <p className="text-3xl font-black text-slate-900">{stats.missed}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 text-red-600"><XCircle size={18} /><span className="text-sm text-slate-500">Cancelled</span></div>
                    <p className="text-3xl font-black text-slate-900">{stats.cancelled}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Calendar + Timeline */}
                <div className="space-y-6">
                    {/* Mini Calendar */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900">{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                            <div className="flex gap-1">
                                <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft size={18} /></button>
                                <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-slate-400 py-1">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, i) => {
                                if (!day) return <div key={i} />;
                                const isToday = day.toDateString() === new Date().toDateString();
                                const isSelected = selectedCalendarDate?.toDateString() === day.toDateString();
                                const hasAppointments = getAppointmentsForDate(day).length > 0;
                                const count = getAppointmentsForDate(day).length;
                                return (
                                    <button key={i}
                                        onClick={() => handleCalendarDateClick(day)}
                                        className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all
                                        ${isSelected ? 'bg-teal-500 text-white ring-2 ring-teal-300 ring-offset-1' :
                                                isToday ? 'bg-blue-500 text-white' :
                                                    hasAppointments ? 'hover:bg-teal-50 font-medium' : 'hover:bg-slate-100'}`}>
                                        {day.getDate()}
                                        {hasAppointments && !isToday && !isSelected && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-teal-500" />}
                                        {count > 0 && (isToday || isSelected) && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{count}</span>}
                                    </button>
                                );
                            })}
                        </div>
                        {selectedCalendarDate && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-600">
                                        Showing: <span className="font-semibold text-teal-600">{selectedCalendarDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    </p>
                                    <button onClick={() => setSelectedCalendarDate(null)} className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1">
                                        <X size={14} /> Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Today's Timeline */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-teal-500" /> Today&apos;s Schedule</h3>
                        {todayAppointments.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <Calendar className="mx-auto mb-2" size={32} />
                                <p className="text-sm">No appointments today</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {todayAppointments.map((apt) => {
                                    const effectiveStatus = getEffectiveStatus(apt);
                                    return (
                                        <div key={apt.appointmentid} className="flex gap-3 group">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full ${effectiveStatus === 'Completed' ? 'bg-green-500' :
                                                    effectiveStatus === 'Cancelled' ? 'bg-red-500' :
                                                        effectiveStatus === 'Missed' ? 'bg-yellow-500' : 'bg-blue-500'
                                                    }`} />
                                                <div className="w-0.5 flex-1 bg-slate-200 group-last:hidden" />
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <p className="text-xs text-slate-400 mb-1">{formatTime(apt.appointmenttime)}</p>
                                                <p className="font-medium text-slate-900 text-sm">{apt.patient?.name || 'Patient'}</p>
                                                <p className="text-xs text-slate-500">Dr. {apt.doctor?.name || 'Doctor'}</p>
                                            </div>
                                            <Badge variant={statusColors[effectiveStatus] || 'default'}>{effectiveStatus}</Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Appointment List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        {/* Filter Tabs */}
                        <div className="border-b border-slate-200 px-4 py-3 flex items-center gap-4 overflow-x-auto">
                            <div className="flex items-center gap-2 text-slate-400"><Filter size={16} /><span className="text-sm font-medium">Filter:</span></div>
                            {(['all', 'Scheduled', 'Completed', 'Missed', 'Cancelled'] as StatusFilter[]).map(status => (
                                <button key={status} onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                                        ${statusFilter === status ? 'bg-teal-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                                    {status === 'all' ? 'All' : status}
                                </button>
                            ))}
                        </div>

                        {/* Appointments List */}
                        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <div key={i} className="p-4 flex gap-4 animate-pulse">
                                        <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-32 bg-slate-200 rounded" />
                                            <div className="h-3 w-24 bg-slate-100 rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : filteredAppointments.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                    <Calendar className="mx-auto mb-3" size={48} />
                                    <p className="font-medium">No appointments found</p>
                                    <p className="text-sm">
                                        {selectedCalendarDate
                                            ? `No appointments on ${selectedCalendarDate.toLocaleDateString()}`
                                            : 'Try changing the filter or add a new appointment'}
                                    </p>
                                </div>
                            ) : (
                                filteredAppointments.map((apt) => {
                                    const effectiveStatus = getEffectiveStatus(apt);
                                    return (
                                        <div key={apt.appointmentid} className="p-4 hover:bg-slate-50 transition-colors group">
                                            <div className="flex items-start gap-4">
                                                {/* Avatar */}
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${effectiveStatus === 'Missed' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                                    effectiveStatus === 'Cancelled' ? 'bg-gradient-to-br from-red-400 to-red-500' :
                                                        effectiveStatus === 'Completed' ? 'bg-gradient-to-br from-green-400 to-green-500' :
                                                            'bg-gradient-to-br from-teal-400 to-blue-500'
                                                    }`}>
                                                    {(apt.patient?.name || 'P')[0]}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{apt.patient?.name || `Patient #${apt.patientid}`}</p>
                                                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                                <span className="flex items-center gap-1"><Stethoscope size={14} className="text-teal-500" /> Dr. {apt.doctor?.name || 'Doctor'}</span>
                                                            </div>
                                                        </div>
                                                        <Badge variant={statusColors[effectiveStatus] || 'default'}>{effectiveStatus}</Badge>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                                                                <Calendar size={14} /> {formatDate(apt.appointmenttime)}
                                                            </span>
                                                            <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                                                                <Clock size={14} /> {formatTime(apt.appointmenttime)}
                                                            </span>
                                                        </div>
                                                        <TableActions>
                                                            <ActionButton icon={Edit2} onClick={() => handleEditAppointment(apt)} variant="edit" title="Edit" />
                                                            <ActionButton icon={Trash2} onClick={() => handleDeleteAppointment(apt)} variant="delete" title="Delete" />
                                                        </TableActions>
                                                    </div>

                                                    {apt.notes && (
                                                        <p className="text-sm text-slate-500 mt-2 bg-slate-50 px-3 py-2 rounded-lg">{apt.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedAppointment ? 'Edit Appointment' : 'Book New Appointment'} size="lg"
                footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : selectedAppointment ? 'Update' : 'Book Appointment'}</Button></>}>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2"><AlertTriangle size={18} className="flex-shrink-0 mt-0.5" /><span>{error}</span></div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect label="Patient" required value={formData.patientid} onChange={(e) => setFormData({ ...formData, patientid: e.target.value })} options={patientOptions} placeholder="Select patient" />
                    <FormSelect label="Doctor" required value={formData.doctorid} onChange={(e) => setFormData({ ...formData, doctorid: e.target.value })} options={doctorOptions} placeholder="Select doctor" />
                    <FormField
                        label="Date & Time"
                        required
                        type="datetime-local"
                        className="md:col-span-2"
                        value={formData.appointmenttime}
                        onChange={(e) => setFormData({ ...formData, appointmenttime: e.target.value })}
                        min={!selectedAppointment ? getMinDateTime() : undefined}
                        hint={!selectedAppointment ? "Appointment must be in the future" : undefined}
                    />
                    {selectedAppointment && (
                        <FormSelect
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={statusOptions}
                            placeholder="Select status"
                            className="md:col-span-2"
                        />
                    )}
                    <FormTextarea label="Notes" className="md:col-span-2" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} placeholder="Additional notes or reason for visit..." />
                </div>
            </Modal>
        </DashboardLayout>
    );
}
