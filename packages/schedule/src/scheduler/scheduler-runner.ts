import { Inject, Injectable } from '@axisparkjs/di';
import { Job } from '../jobs/job';
import { Logger } from '@axisparkjs/logger';
import { SCHEDULE_LOGGER } from '../di';

@Injectable()
export class SchedulerRunner {
    private readonly runningJobs = new Map<string, NodeJS.Timeout>();
    private readonly enabledJobs = new Set<string>();

    constructor(@Inject(SCHEDULE_LOGGER) private readonly logger: Logger) {}

    start(job: Job): void {
        if (this.runningJobs.has(job.name)) return;
        this.enabledJobs.add(job.name);
        this.schedule(job);
    }

    stop(job: Job): void {
        this.enabledJobs.delete(job.name);

        const timeout = this.runningJobs.get(job.name);
        if (timeout) {
            clearTimeout(timeout);
        }

        this.runningJobs.delete(job.name);
    }

    isRunning(job: Job): boolean {
        return this.runningJobs.has(job.name);
    }

    startAll(jobs: Job[]): void {
        jobs.forEach((job) => this.start(job));
    }

    stopAll(jobs: Job[]): void {
        jobs.forEach((job) => this.stop(job));
    }

    private schedule(job: Job): void {
        const nextExecutionTime = job.getNextExecutionTime();
        if (!nextExecutionTime || nextExecutionTime.getTime() <= Date.now()) return;

        const delay = nextExecutionTime.getTime() - Date.now();
        const timeout = setTimeout(async () => {
            try {
                await job.execute();
            } catch (error) {
                this.logger.error(`Error executing job ${job.name}:`, error as Error);
            } finally {
                this.runningJobs.delete(job.name);
                if (this.enabledJobs.has(job.name)) this.schedule(job);
            }
        }, delay);

        this.runningJobs.set(job.name, timeout);
    }
}
