/**
 * Centralized API Client for DCMS Backend
 * All requests go through the NestJS backend at http://localhost:3001
 */

import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'dcms_token';

// ============ Token Management ============

export function getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
}

export function setToken(token: string): void {
    Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7 days
}

export function removeToken(): void {
    Cookies.remove(TOKEN_KEY);
}

// ============ Base Fetch Wrapper ============

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                removeToken();
                return { error: 'Unauthorized - Please login again' };
            }
            const errorData = await response.json().catch(() => ({}));
            return { error: errorData.message || `Error: ${response.status}` };
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        console.error('API request failed:', error);
        return { error: 'Network error - Please check your connection' };
    }
}

// ============ Auth API ============

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: {
        userid: number;
        username: string;
        role: string;
    };
}

export async function login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const result = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });

    if (result.data?.access_token) {
        setToken(result.data.access_token);
    }

    return result;
}

export function logout(): void {
    removeToken();
}

// ============ Patients API ============

export interface Patient {
    patientid: number;
    name: string;
    dateofbirth: string;
    gender?: string;
    phone?: string;
    address?: string;
    medicalhistory?: string;
}

export interface CreatePatientDto {
    name: string;
    dateofbirth: string;
    gender?: string;
    phone?: string;
    address?: string;
    medicalhistory?: string;
}

export async function getPatients(): Promise<ApiResponse<Patient[]>> {
    return apiRequest<Patient[]>('/patients');
}

export async function getPatient(id: number): Promise<ApiResponse<Patient>> {
    return apiRequest<Patient>(`/patients/${id}`);
}

export async function createPatient(data: CreatePatientDto): Promise<ApiResponse<Patient>> {
    return apiRequest<Patient>('/patients', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ============ Doctors API ============

export interface Doctor {
    doctorid: number;
    userid: number;
    name: string;
    specialization?: string;
    phone?: string;
    email?: string;
    schedule?: object;
}

export interface CreateDoctorDto {
    userid: number;
    name: string;
    specialization?: string;
    phone?: string;
    email?: string;
    schedule?: object;
}

export async function getDoctors(): Promise<ApiResponse<Doctor[]>> {
    return apiRequest<Doctor[]>('/doctors');
}

export async function getDoctor(id: number): Promise<ApiResponse<Doctor>> {
    return apiRequest<Doctor>(`/doctors/${id}`);
}

export async function createDoctor(data: CreateDoctorDto): Promise<ApiResponse<Doctor>> {
    return apiRequest<Doctor>('/doctors', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ============ Appointments API ============

export interface Appointment {
    appointmentid: number;
    patientid: number;
    doctorid: number;
    receptionistid?: number;
    treatmentid?: number;
    appointmenttime: string;
    status?: string;
    notes?: string;
    patient?: Patient;
    doctor?: Doctor;
}

export interface CreateAppointmentDto {
    patientid: number;
    doctorid: number;
    appointmenttime: string;
    receptionistid?: number;
    treatmentid?: number;
    notes?: string;
}

export async function getAppointments(): Promise<ApiResponse<Appointment[]>> {
    return apiRequest<Appointment[]>('/appointments');
}

export async function getAppointment(id: number): Promise<ApiResponse<Appointment>> {
    return apiRequest<Appointment>(`/appointments/${id}`);
}

export async function createAppointment(data: CreateAppointmentDto): Promise<ApiResponse<Appointment>> {
    return apiRequest<Appointment>('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ============ Treatments API ============

export interface Treatment {
    treatmentid: number;
    patientid: number;
    name: string;
    description?: string;
    status?: string;
    startdate?: string;
    enddate?: string;
}

export interface CreateTreatmentDto {
    patientid: number;
    name: string;
    description?: string;
    status?: string;
    startdate?: string;
    enddate?: string;
}

export async function getTreatments(): Promise<ApiResponse<Treatment[]>> {
    return apiRequest<Treatment[]>('/treatments');
}

export async function getTreatment(id: number): Promise<ApiResponse<Treatment>> {
    return apiRequest<Treatment>(`/treatments/${id}`);
}

export async function createTreatment(data: CreateTreatmentDto): Promise<ApiResponse<Treatment>> {
    return apiRequest<Treatment>('/treatments', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ============ Medicines API ============

export interface Medicine {
    medicineid: number;
    name: string;
    quantity: number;
    price: number;
    availabilitystatus: boolean;
}

export interface CreateMedicineDto {
    name: string;
    quantity: number;
    price: number;
    availabilitystatus?: boolean;
}

export async function getMedicines(): Promise<ApiResponse<Medicine[]>> {
    return apiRequest<Medicine[]>('/medicines');
}

export async function getMedicine(id: number): Promise<ApiResponse<Medicine>> {
    return apiRequest<Medicine>(`/medicines/${id}`);
}

export async function createMedicine(data: CreateMedicineDto): Promise<ApiResponse<Medicine>> {
    return apiRequest<Medicine>('/medicines', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ============ Prescriptions API ============

export interface Prescription {
    prescriptionid: number;
    appointmentid: number;
    date: string;
    notes?: string;
}

export interface CreatePrescriptionDto {
    appointmentid: number;
    date: string;
    notes?: string;
}

export async function getPrescriptions(): Promise<ApiResponse<Prescription[]>> {
    return apiRequest<Prescription[]>('/prescriptions');
}

export async function getPrescription(id: number): Promise<ApiResponse<Prescription>> {
    return apiRequest<Prescription>(`/prescriptions/${id}`);
}

export async function createPrescription(data: CreatePrescriptionDto): Promise<ApiResponse<Prescription>> {
    return apiRequest<Prescription>('/prescriptions', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updatePrescription(id: number, data: Partial<CreatePrescriptionDto>): Promise<ApiResponse<Prescription>> {
    return apiRequest<Prescription>(`/prescriptions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deletePrescription(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/prescriptions/${id}`, {
        method: 'DELETE',
    });
}

// ============ Billing API ============

export interface Billing {
    billingid: number;
    appointmentid: number;
    patientid: number;
    totalamount: number;
    type: 'Standard' | 'FBR';
    paymentstatus?: string;
    date: string;
}

export interface CreateBillingDto {
    appointmentid: number;
    patientid: number;
    totalamount: number;
    type: 'Standard' | 'FBR';
    paymentstatus?: string;
    date: string;
}

export async function getBillings(): Promise<ApiResponse<Billing[]>> {
    return apiRequest<Billing[]>('/billing');
}

export async function getBilling(id: number): Promise<ApiResponse<Billing>> {
    return apiRequest<Billing>(`/billing/${id}`);
}

export async function createBilling(data: CreateBillingDto): Promise<ApiResponse<Billing>> {
    return apiRequest<Billing>('/billing', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateBilling(id: number, data: Partial<CreateBillingDto>): Promise<ApiResponse<Billing>> {
    return apiRequest<Billing>(`/billing/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteBilling(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/billing/${id}`, {
        method: 'DELETE',
    });
}

// ============ Users API ============

export interface User {
    userid: string;
    username: string;
    role: string;
    isdeleted: boolean;
    profile?: {
        name?: string;
        phone?: string;
        email?: string;
        specialization?: string;
    };
}

export interface CreateUserDto {
    username: string;
    password: string;
    role: string;
    name?: string;
    phone?: string;
    specialization?: string;
    email?: string;
    doctorid?: number;
}

export interface UpdateUserDto {
    username?: string;
    password?: string;
    name?: string;
    phone?: string;
    specialization?: string;
    email?: string;
}

export async function getUsers(): Promise<ApiResponse<User[]>> {
    return apiRequest<User[]>('/users');
}

export async function getUser(id: number): Promise<ApiResponse<User>> {
    return apiRequest<User>(`/users/${id}`);
}

export async function createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
    return apiRequest<User>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateUser(id: number, data: UpdateUserDto): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteUser(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/users/${id}`, {
        method: 'DELETE',
    });
}

