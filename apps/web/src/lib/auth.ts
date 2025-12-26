export type Role = 'admin' | 'doctor' | 'patient' | 'pharmacist' | 'receptionist' | 'assistant';

export const checkPermission = (userRole: Role, requiredRole: Role[]) => {
  return requiredRole.includes(userRole);
};