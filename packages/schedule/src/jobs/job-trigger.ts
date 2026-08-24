import { CronTime, validateCronExpression } from 'cron';
import { JobError } from '../errors/job-error';

/**
 * An abstract class representing a job trigger.
 */
export abstract class JobTrigger {
    public readonly createdAt: Date;

    constructor() {
        this.createdAt = new Date();
    }

    /**
     * Gets the next execution time for the job.
     * @param lastExecutionTime The time of the last execution.
     * @returns The next execution time, or undefined if the job has no more executions.
     */
    abstract getNextExecutionTime(lastExecutionTime?: Date): Date | undefined;
}

/**
 * A class representing a cron-based job trigger.
 */
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

/**
 * A class representing an interval-based job trigger.
 */
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

/**
 * A class representing a date-based job trigger.
 */
export class DateJobTrigger extends JobTrigger {
    constructor(public readonly date: Date) {
        if (date.getTime() <= Date.now()) throw new JobError(`Date must be in the future, got: ${date}`);
        super();
    }

    getNextExecutionTime(): Date | undefined {
        if (this.date.getTime() <= Date.now()) return undefined;
        return this.date;
    }
}

/**
 * A class representing a timeout-based job trigger.
 */
export class TimeoutJobTrigger extends JobTrigger {
    constructor(public readonly timeout: number) {
        if (timeout <= 0) throw new JobError(`Timeout must be greater than 0, got: ${timeout}`);
        super();
    }

    getNextExecutionTime(): Date | undefined {
        return new Date(this.createdAt.getTime() + this.timeout);
    }
}
