import { Executable } from '@axisparkjs/common';
import { CronJobTrigger, DateJobTrigger, IntervalJobTrigger, JobTrigger, TimeoutJobTrigger } from './job-trigger';
import { JobMetadata } from '../metadata';

export enum JobType {
    Cron = 'cron',
    Interval = 'interval',
    Date = 'date',
    Timeout = 'timeout'
}

export abstract class JobDefinition implements Executable {
    abstract readonly type: JobType;
    protected abstract trigger: JobTrigger;
    protected lastExecutionTime?: Date;

    public constructor(
        public readonly name: string,
        private readonly job: () => Promise<void>,
        public readonly initiallyDisabled = false
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

    public static fromMetadata(metadata: JobMetadata, execute: () => Promise<void>): JobDefinition {
        switch (metadata.type) {
            case JobType.Cron:
                return new CronJobDefinitio(metadata.name, metadata.value as string, execute, metadata.disabled, metadata.timeZone);
            case JobType.Interval:
                return new IntervalJobDefinition(metadata.name, metadata.value as number, execute, metadata.disabled);
            case JobType.Date:
                return new DateJobDefinition(metadata.name, metadata.value as Date, execute, metadata.disabled);
            case JobType.Timeout:
                return new TimeoutJobDefinition(metadata.name, metadata.value as number, execute, metadata.disabled);
        }
    }
}

export class CronJobDefinitio extends JobDefinition {
    readonly type: JobType = JobType.Cron;
    protected readonly trigger: CronJobTrigger;

    constructor(name: string, cronExpression: string, execute: () => Promise<void>, initiallyDisabled?: boolean, timeZone?: string) {
        super(name, execute, initiallyDisabled);
        this.trigger = new CronJobTrigger(cronExpression, timeZone);
    }

    public updateCronExpression(cronExpression: string, timeZone?: string): void {
        this.changeTrigger(new CronJobTrigger(cronExpression, timeZone));
    }
}

export class IntervalJobDefinition extends JobDefinition {
    readonly type: JobType = JobType.Interval;
    protected readonly trigger: JobTrigger;

    constructor(name: string, interval: number, execute: () => Promise<void>, initiallyDisabled?: boolean) {
        super(name, execute, initiallyDisabled);
        this.trigger = new IntervalJobTrigger(interval);
    }

    public updateInterval(interval: number): void {
        this.changeTrigger(new IntervalJobTrigger(interval));
    }
}

export class DateJobDefinition extends JobDefinition {
    readonly type: JobType = JobType.Date;
    protected readonly trigger: JobTrigger;

    constructor(name: string, date: Date, execute: () => Promise<void>, initiallyDisabled?: boolean) {
        super(name, execute, initiallyDisabled);
        this.trigger = new DateJobTrigger(date);
    }

    public updateDate(date: Date): void {
        this.changeTrigger(new DateJobTrigger(date));
    }
}

export class TimeoutJobDefinition extends JobDefinition {
    readonly type: JobType = JobType.Timeout;
    protected readonly trigger: JobTrigger;

    constructor(name: string, timeout: number, execute: () => Promise<void>, initiallyDisabled?: boolean) {
        super(name, execute, initiallyDisabled);
        this.trigger = new TimeoutJobTrigger(timeout);
    }

    public updateTimeout(timeout: number): void {
        this.changeTrigger(new TimeoutJobTrigger(timeout));
    }
}
