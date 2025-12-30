// Status color mappings for consistent styling across pages
export const statusColors = {
    Scheduled: 'info',
    Completed: 'success',
    Cancelled: 'danger',
    Paid: 'success',
    PAID: 'success',
    Pending: 'warning',
    PENDING: 'warning',
    CANCELLED: 'danger',
    Active: 'info',
} as const;

// Role colors for user badges
export const roleColors = {
    ADMIN: 'danger',
    DOCTOR: 'info',
    RECEPTIONIST: 'success',
    PHARMACIST: 'warning',
    ASSISTANT: 'purple',
} as const;

// Common gradient classes for stat cards
export const gradients = {
    emerald: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-pink-600',
    amber: 'from-amber-500 to-orange-600',
    teal: 'from-teal-400 to-teal-600',
    green: 'from-green-400 to-green-600',
    orange: 'from-orange-500 to-red-600',
} as const;

// Specialization options for doctors
export const specializationOptions = [
    { value: 'General Dentistry', label: 'General Dentistry' },
    { value: 'Orthodontics', label: 'Orthodontics' },
    { value: 'Periodontics', label: 'Periodontics' },
    { value: 'Endodontics', label: 'Endodontics' },
    { value: 'Oral Surgery', label: 'Oral Surgery' },
    { value: 'Pediatric Dentistry', label: 'Pediatric Dentistry' },
    { value: 'Prosthodontics', label: 'Prosthodontics' },
];

// Role options for user forms
export const roleOptions = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'RECEPTIONIST', label: 'Receptionist' },
    { value: 'PHARMACIST', label: 'Pharmacist' },
    { value: 'ASSISTANT', label: 'Assistant' },
];

// Gender options
export const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
];

// Payment status options
export const paymentStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Cancelled', label: 'Cancelled' },
];

// Treatment status options
export const treatmentStatusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
];

// Invoice type options
export const invoiceTypeOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'FBR', label: 'FBR (Tax Invoice)' },
];
