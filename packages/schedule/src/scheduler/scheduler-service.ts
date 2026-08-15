import { Injectable } from '@axisparkjs/di';
import { SchedulerRegistry } from './scheduler-registry';
import { SchedulerRunner } from './scheduler-runner';
import { JobDefinition } from '../jobs';
import { SchedulerError } from '../errors';

@Injectable()
export class SchedulerService {
    constructor(
        private readonly registry: SchedulerRegistry,
        private readonly runner: SchedulerRunner
    ) {}

    registerJob(job: JobDefinition): void {
        this.registry.registerJob(job);
    }

    registerJobs(jobs: JobDefinition[]): void {
        jobs.forEach((job) => this.registerJob(job));
    }

    startJob(job: string | JobDefinition): void {
        const jobInstance = this.registry.getJob(typeof job === 'string' ? job : job.name);
        if (!jobInstance && typeof job === 'string') throw new SchedulerError(`Job with name "${job}" is not registered.`);
        if (!jobInstance && job instanceof JobDefinition) this.registry.registerJob(job);

        this.runner.start(jobInstance || (job as JobDefinition));
    }

    startAllJobs(onlyInitiallyEnabled = false): void {
        const jobs = this.registry.getAllJobs().filter((job) => !onlyInitiallyEnabled || !job.initiallyDisabled);
        this.runner.startAll(jobs);
    }

    stopJob(job: string | JobDefinition): void {
        const jobInstance = this.registry.getJob(typeof job === 'string' ? job : job.name);
        if (!jobInstance) return;

        this.runner.stop(jobInstance);
    }

    stopAllJobs(): void {
        const jobs = this.registry.getAllJobs();
        this.runner.stopAll(jobs);
    }

    isJobRunning(job: string | JobDefinition): boolean {
        const jobInstance = this.registry.getJob(typeof job === 'string' ? job : job.name);
        if (!jobInstance) return false;

        return this.runner.isRunning(jobInstance);
    }
}
