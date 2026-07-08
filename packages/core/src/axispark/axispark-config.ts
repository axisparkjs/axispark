import { LogTransport } from '@axisparkjs/logger';

export interface AxisparkConfig {
    name?: string;
    environment?: 'production' | 'development' | 'test';
    banner?: boolean;
    logTransports?: LogTransport[];
}
