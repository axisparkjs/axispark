import { HealthStatus } from './health-status';

export interface HealthData {
    component: string;
    status: HealthStatus;
    timestamp: string;
    details?: Record<string, any>;
}
