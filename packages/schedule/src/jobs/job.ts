import { Executable } from '@axisparkjs/common';
import { CronJobTrigger, DateJobTrigger, IntervalJobTrigger, JobTrigger, TimeoutJobTrigger } from './job-trigger';
import { CronJobMetadata, JobMetadata } from '../metadata';

export enum JobType {
    Cron = 'cron',
    Interval = 'interval',
    Date = 'date',
    Timeout = 'timeout'
}

export abstract class Job implements Executable {
    abstract readonly type: JobType;
    protected abstract trigger: JobTrigger;
    protected lastExecutionTime?: Date;

    public constructor(
        public readonly name: string,
        private readonly job: () => Promise<void>
    ) {}

    protected changeTrigger(trigger: JobTrigger): void {
        this.trigger = trigger;
    }

    public getLastExecutionTime(): Date | undefined {
        return this.lastExecutionTime;
    }

    public getNextExecutionTime(): Date | undefined {
        return this.trigger.getNextExecutionTime(this.lastExecutionTime);
    }

    public async execute(): Promise<void> {
        this.lastExecutionTime = new Date();
        await this.job();
    }

    public static fromMetadata(metadata: JobMetadata, execute: () => Promise<void>): Job {
        switch (metadata.type) {
            case JobType.Cron:
                return new CronJob(metadata.name, metadata.value as string, execute, (metadata as CronJobMetadata).timeZone);
            case JobType.Interval:
                return new IntervalJob(metadata.name, metadata.value as number, execute);
            case JobType.Date:
                return new DateJob(metadata.name, metadata.value as Date, execute);
            case JobType.Timeout:
                return new TimeoutJob(metadata.name, metadata.value as number, execute);
            default:
                throw new Error(`Unsupported job type: ${metadata.type}`);
        }
    }
}

export class CronJob extends Job {
    readonly type: JobType = JobType.Cron;
    protected readonly trigger: CronJobTrigger;

    constructor(name: string, cronExpression: string, execute: () => Promise<void>, timeZone?: string) {
        super(name, execute);
        this.trigger = new CronJobTrigger(cronExpression, timeZone);
    }

    public updateCronExpression(cronExpression: string, timeZone?: string): void {
        this.changeTrigger(new CronJobTrigger(cronExpression, timeZone));
    }
}

export class IntervalJob extends Job {
    readonly type: JobType = JobType.Interval;
    protected readonly trigger: JobTrigger;

    constructor(name: string, interval: number, execute: () => Promise<void>) {
        super(name, execute);
        this.trigger = new IntervalJobTrigger(interval);
    }

    public updateInterval(interval: number): void {
        this.changeTrigger(new IntervalJobTrigger(interval));
    }
}

export class DateJob extends Job {
    readonly type: JobType = JobType.Date;
    protected readonly trigger: JobTrigger;

    constructor(name: string, date: Date, execute: () => Promise<void>) {
        super(name, execute);
        this.trigger = new DateJobTrigger(date);
    }

    public updateDate(date: Date): void {
        this.changeTrigger(new DateJobTrigger(date));
    }
}

export class TimeoutJob extends Job {
    readonly type: JobType = JobType.Timeout;
    protected readonly trigger: JobTrigger;

    constructor(name: string, timeout: number, execute: () => Promise<void>) {
        super(name, execute);
        this.trigger = new TimeoutJobTrigger(timeout);
    }

    public updateTimeout(timeout: number): void {
        this.changeTrigger(new TimeoutJobTrigger(timeout));
    }
}
