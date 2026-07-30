import { LogTransport } from '@axisparkjs/logger';

export interface AxiSparkConfig {
    name?: string;
    environment?: 'production' | 'development' | 'test';
    banner?: boolean;
    logTransports?: LogTransport[];
}
