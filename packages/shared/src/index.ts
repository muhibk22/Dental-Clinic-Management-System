export const SHARED_CONSTANT = "Hello from Shared";

export interface HealthCheckResponse {
    status: 'ok' | 'error';
    timestamp: string;
    message: string;
}

