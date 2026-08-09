import { InjectionToken } from '@axisparkjs/di';
import { LogTransport } from '@axisparkjs/logger';

export const AXISPARK_CONFIG = new InjectionToken('AXISPARK_CONFIG');
export interface AxiSparkConfig {
    name?: string;
    basePath?: string;
    environment?: 'production' | 'development' | 'test';
    banner?: boolean;
    logTransports?: LogTransport[];
}
