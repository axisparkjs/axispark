import { CronTime, validateCronExpression } from 'cron';
import { JobError } from '../errors/job-error';

export abstract class JobTrigger {
    public readonly createdAt: Date;

    constructor() {
        this.createdAt = new Date();
    }

    abstract getNextExecutionTime(lastExecutionTime?: Date): Date | undefined;
}

export class CronJobTrigger extends JobTrigger {
    private readonly cronTime: CronTime;

    constructor(
        public readonly cronExpression: string,
        timeZone?: string
    ) {
        const valid = validateCronExpression(cronExpression);
        if (!valid) throw new JobError(`Invalid cron expression: ${cronExpression}`);

        super();
        this.cronTime = new CronTime(cronExpression, timeZone);
    }

    getNextExecutionTime(lastExecutionTime?: Date): Date | undefined {
        const baseTime = lastExecutionTime || this.createdAt;

        try {
            return this.cronTime.getNextDateFrom(baseTime).toJSDate();
        } catch (error) {
            throw new JobError(`Failed to calculate next execution time for cron expression: ${this.cronExpression}`);
        }
    }
}

export class IntervalJobTrigger extends JobTrigger {
    constructor(public readonly interval: number) {
        if (interval <= 0) throw new JobError(`Interval must be greater than 0, got: ${interval}`);
        super();
    }

    getNextExecutionTime(lastExecutionTime?: Date): Date | undefined {
        if (!lastExecutionTime) return new Date(this.createdAt.getTime() + this.interval);

        return new Date(lastExecutionTime.getTime() + this.interval);
    }
}

export class DateJobTrigger extends JobTrigger {
    constructor(public readonly date: Date) {
        if (date.getTime() <= new Date().getTime()) throw new JobError(`Date must be in the future, got: ${date}`);
        super();
    }

    getNextExecutionTime(): Date | undefined {
        if (this.date.getTime() <= new Date().getTime()) return undefined;
        return this.date;
    }
}

export class TimeoutJobTrigger extends JobTrigger {
    constructor(public readonly timeout: number) {
        if (timeout <= 0) throw new JobError(`Timeout must be greater than 0, got: ${timeout}`);
        super();
    }

    getNextExecutionTime(): Date | undefined {
        return new Date(this.createdAt.getTime() + this.timeout);
    }
}
