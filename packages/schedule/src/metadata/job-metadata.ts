import { Constructor } from '@axisparkjs/di';
import { JobType } from '../jobs';

export interface JobMetadata {
    name: string;
    value: number | string | Date;
    disabled: boolean;
    type: JobType;
    target: Constructor;
    propertyKey: string | symbol;
}

export interface CronJobMetadata extends JobMetadata {
    type: JobType.Cron;
    value: string;
    timeZone?: string;
}
