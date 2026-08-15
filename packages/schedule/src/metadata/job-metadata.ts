import { MetadataFromMethod } from '@axisparkjs/common';
import { JobType } from '../jobs';

export interface JobMetadataBase extends MetadataFromMethod {
    type: JobType;
    value: any;
    name: string;
    disabled: boolean;
}
export interface CronJobMetadata extends JobMetadataBase {
    type: JobType.Cron;
    value: string;
    timeZone?: string;
}

export interface IntervalJobMetadata extends JobMetadataBase {
    type: JobType.Interval;
    value: number;
}

export interface DateJobMetadata extends JobMetadataBase {
    type: JobType.Date;
    value: Date;
}

export interface TimeoutJobMetadata extends JobMetadataBase {
    type: JobType.Timeout;
    value: number;
}

export type JobMetadata = JobMetadataBase & (CronJobMetadata | IntervalJobMetadata | DateJobMetadata | TimeoutJobMetadata);
