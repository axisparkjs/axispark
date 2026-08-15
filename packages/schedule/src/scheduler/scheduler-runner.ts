import { Injectable } from '@axisparkjs/di';
import { JobDefinition } from '../jobs/job-definition';

@Injectable()
export class SchedulerRunner {
    private readonly runningJobs = new Map<string, NodeJS.Timeout>();
    private readonly enabledJobs = new Set<string>();

    start(job: JobDefinition): void {
        if (this.runningJobs.has(job.name)) return;
        this.enabledJobs.add(job.name);
        this.schedule(job);
    }

    stop(job: JobDefinition): void {
        this.enabledJobs.delete(job.name);

        const timeout = this.runningJobs.get(job.name);
        if (timeout) {
            clearTimeout(timeout);
        }

        this.runningJobs.delete(job.name);
    }

    isRunning(job: JobDefinition): boolean {
        return this.runningJobs.has(job.name);
    }

    startAll(jobs: JobDefinition[]): void {
        jobs.forEach((job) => this.start(job));
    }

    stopAll(jobs: JobDefinition[]): void {
        jobs.forEach((job) => this.stop(job));
    }

    private schedule(job: JobDefinition): void {
        const nextExecutionTime = job.getNextExecutionTime();
        if (!nextExecutionTime || nextExecutionTime.getTime() <= Date.now()) return;

        const delay = nextExecutionTime.getTime() - Date.now();
        const timeout = setTimeout(async () => {
            try {
                await job.execute();
            } catch {
                /*empty*/
            } finally {
                this.runningJobs.delete(job.name);
                if (this.enabledJobs.has(job.name)) this.schedule(job);
            }
        }, delay);

        this.runningJobs.set(job.name, timeout);
    }
}
