import { Injectable } from '@axisparkjs/di';
import { SchedulerRegistry } from './scheduler-registry';
import { SchedulerRunner } from './scheduler-runner';
import { Job } from '../jobs';
import { SchedulerError } from '../errors';

@Injectable()
export class SchedulerService {
    constructor(
        private readonly registry: SchedulerRegistry,
        private readonly runner: SchedulerRunner
    ) {}

    registerJob(job: Job, start = false): void {
        this.registry.registerJob(job);
        if (start) {
            this.runner.start(job);
        }
    }

    registerJobs(jobs: { job: Job; start: boolean }[]): void {
        jobs.forEach((job) => this.registerJob(job.job, job.start));
    }

    startJob(job: string | Job): void {
        const jobInstance = this.registry.getJob(typeof job === 'string' ? job : job.name);
        if (!jobInstance && typeof job === 'string') throw new SchedulerError(`Job with name "${job}" is not registered.`);
        if (!jobInstance && job instanceof Job) this.registry.registerJob(job);

        this.runner.start(jobInstance || (job as Job));
    }

    startAllJobs(): void {
        const jobs = this.registry.getAllJobs();
        this.runner.startAll(jobs);
    }

    stopJob(job: string | Job): void {
        const jobInstance = this.registry.getJob(typeof job === 'string' ? job : job.name);
        if (!jobInstance) return;

        this.runner.stop(jobInstance);
    }

    stopAllJobs(): void {
        const jobs = this.registry.getAllJobs();
        this.runner.stopAll(jobs);
    }

    isJobRunning(job: string | Job): boolean {
        const jobInstance = this.registry.getJob(typeof job === 'string' ? job : job.name);
        if (!jobInstance) return false;

        return this.runner.isRunning(jobInstance);
    }
}
