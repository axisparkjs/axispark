import { JobDefinition, JobType } from '../jobs/job-definition';
import { SchedulerError } from '../errors/scheduler-error';
import { Injectable } from '@axisparkjs/di';

/**
 * A registry for managing scheduled jobs.
 */
@Injectable()
export class SchedulerRegistry {
    private readonly jobs = new Map<string, JobDefinition>();

    /**
     * Registers a job with the scheduler.
     * @param job The job to register.
     */
    registerJob(job: JobDefinition): void {
        if (this.jobs.has(job.name)) {
            throw new SchedulerError(`Job with name "${job.name}" is already registered.`);
        }
        this.jobs.set(job.name, job);
    }

    /**
     * Checks if a job exists in the scheduler.
     * @param name The name of the job to check.
     * @returns True if the job exists, false otherwise.
     */
    existsJob(name: string): boolean {
        return this.jobs.has(name);
    }

    /**
     * Gets a job from the scheduler.
     * @param name The name of the job to get.
     * @returns The job, or undefined if not found.
     */
    getJob(name: string): JobDefinition | undefined {
        return this.jobs.get(name);
    }

    /**
     * Gets all jobs from the scheduler.
     * @param type The type of jobs to get.
     * @returns An array of jobs.
     */
    getAllJobs(type?: JobType): JobDefinition[] {
        return Array.from(this.jobs.values()).filter((item) => (type !== undefined ? item.type === type : true));
    }

    /**
     * Removes a job from the scheduler.
     * @param name The name of the job to remove.
     */
    removeJob(name: string | JobDefinition): void {
        const jobName = typeof name === 'string' ? name : name.name;
        this.jobs.delete(jobName);
    }
}
