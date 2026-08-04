import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { JobMetadata } from '../metadata/job-metadata';
import { JobType } from '../jobs';
import { Constructor } from '@axisparkjs/di';

function Job(data: { type: JobType; value: number | string | Date; name?: string; disabled?: boolean; metadata?: any }): MethodDecorator {
    return (target, propertyKey) => {
        const jobs = Metadata.get<JobMetadata[]>(MetadataKeys.JOB, target) ?? [];

        jobs.push({
            name: data.name ?? `${target.constructor.name.toLocaleLowerCase()}.${propertyKey.toString().toLocaleLowerCase()}`,
            value: data.value,
            disabled: data.disabled ?? false,
            type: data.type,
            target: target.constructor as Constructor,
            propertyKey,
            ...data.metadata
        });

        Metadata.define(MetadataKeys.JOB, jobs, target);
    };
}

export const Cron = (data: string | { cronExpression: string; name: string; disabled?: boolean; timeZone?: any }) => {
    const { cronExpression, name, disabled, timeZone } = typeof data === 'string' ? { cronExpression: data, name: undefined, disabled: undefined, timeZone: undefined } : data;
    return Job({ type: JobType.Cron, value: cronExpression, name, disabled, metadata: { timeZone } });
};

export const Interval = (data: number | { interval: number; name: string; disabled?: boolean }) => {
    const { interval, name, disabled } = typeof data === 'number' ? { interval: data, name: undefined, disabled: undefined } : data;
    return Job({ type: JobType.Interval, value: interval, name, disabled });
};

export const DateSchedule = (data: Date | { date: Date; name: string; disabled?: boolean }) => {
    const { date, name, disabled } = data instanceof Date ? { date: data, name: undefined, disabled: undefined } : data;
    return Job({ type: JobType.Date, value: date as Date, name, disabled });
};

export const Timeout = (data: number | { timeout: number; name: string; disabled?: boolean }) => {
    const { timeout, name, disabled } = typeof data === 'number' ? { timeout: data, name: undefined, disabled: undefined } : data;
    return Job({ type: JobType.Timeout, value: timeout, name, disabled });
};
