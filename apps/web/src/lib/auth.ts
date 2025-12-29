export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'PHARMACIST' | 'RECEPTIONIST' | 'ASSISTANT';

export const checkPermission = (userRole: Role, requiredRoles: Role[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Role display names for UI
export const roleDisplayNames: Record<Role, string> = {
  ADMIN: 'Administrator',
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
  PHARMACIST: 'Pharmacist',
  RECEPTIONIST: 'Receptionist',
  ASSISTANT: 'Assistant',
};

// Dashboard paths for each role
export const roleDashboardPaths: Record<Role, string> = {
  ADMIN: '/dashboard/admin',
  DOCTOR: '/dashboard/doctor',
  PATIENT: '/dashboard/patient',
  PHARMACIST: '/dashboard/pharmacist',
  RECEPTIONIST: '/dashboard/receptionist',
  ASSISTANT: '/dashboard/assistant',
};

// Get dashboard path for a role (case-insensitive)
export function getDashboardPath(role: string): string {
  const upperRole = role.toUpperCase() as Role;
  return roleDashboardPaths[upperRole] || '/login';
}