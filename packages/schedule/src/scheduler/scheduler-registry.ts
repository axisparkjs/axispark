import { Job, JobType } from '../jobs/job';
import { SchedulerError } from '../errors/scheduler-error';
import { Inject, Injectable } from '@axisparkjs/di';
import { SCHEDULE_LOGGER } from '../di';
import { Logger } from '@axisparkjs/logger';

@Injectable()
export class SchedulerRegistry {
    private readonly jobs = new Map<string, Job>();

    constructor(@Inject(SCHEDULE_LOGGER) private readonly logger: Logger) {}

    registerJob(job: Job): void {
        if (this.jobs.has(job.name)) {
            throw new SchedulerError(`Job with name "${job.name}" is already registered.`);
        }
        this.jobs.set(job.name, job);
        this.logger.info(`Registered job ${job.name}`);
    }

    existsJob(name: string): boolean {
        return this.jobs.has(name);
    }

    getJob(name: string): Job | undefined {
        return this.jobs.get(name);
    }

    getAllJobs(type?: JobType): Job[] {
        return Array.from(this.jobs.values()).filter((item) => (type !== undefined ? item.type === type : true));
    }

    removeJob(name: string | Job): void {
        const jobName = typeof name === 'string' ? name : name.name;
        this.jobs.delete(jobName);
        this.logger.debug(`Removed job ${jobName}`);
    }
}
