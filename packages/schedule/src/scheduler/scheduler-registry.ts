import { JobDefinition, JobType } from '../jobs/job-definition';
import { SchedulerError } from '../errors/scheduler-error';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class SchedulerRegistry {
    private readonly jobs = new Map<string, JobDefinition>();

    registerJob(job: JobDefinition): void {
        if (this.jobs.has(job.name)) {
            throw new SchedulerError(`Job with name "${job.name}" is already registered.`);
        }
        this.jobs.set(job.name, job);
    }

    existsJob(name: string): boolean {
        return this.jobs.has(name);
    }

    getJob(name: string): JobDefinition | undefined {
        return this.jobs.get(name);
    }

    getAllJobs(type?: JobType): JobDefinition[] {
        return Array.from(this.jobs.values()).filter((item) => (type !== undefined ? item.type === type : true));
    }

    removeJob(name: string | JobDefinition): void {
        const jobName = typeof name === 'string' ? name : name.name;
        this.jobs.delete(jobName);
    }
}
