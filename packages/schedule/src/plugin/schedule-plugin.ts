import { AxiSparkContext, Plugin, Pluggable } from '@axisparkjs/core';
import { SCHEDULE_LOGGER } from '../di/tokens';
import { Logger } from '@axisparkjs/logger';
import { SchedulerService } from '../scheduler';
import { JobGenerator } from '../jobs/job-generator';
import { Job } from '../jobs';

@Plugin()
export class SchedulePlugin implements Pluggable {
    private logger!: Logger;
    private scheduler: SchedulerService;
    private jobsToStart: Job[] = [];

    async onRegister(context: AxiSparkContext): Promise<void> {
        this.logger = context.container.resolve(Logger).child('SchedulePlugin');

        this.registerContainerBindings(context);
        this.initializeScheduler(context);

        await this.logger.info(`Plugin registered`);
    }

    private registerContainerBindings(context: AxiSparkContext): void {
        context.container.bind({ token: SCHEDULE_LOGGER, useValue: this.logger });
    }

    private initializeScheduler(context: AxiSparkContext): void {
        this.scheduler = context.container.resolve(SchedulerService);
        const jobs = JobGenerator.generate(context);
        this.jobsToStart = jobs.filter((job) => !job.disabled).map((job) => job.job);
        this.scheduler.registerJobs(jobs.map((job) => ({ job: job.job, start: false })));
    }

    async onStart(): Promise<void> {
        for (const job of this.jobsToStart) {
            this.scheduler.startJob(job);
        }
        await this.logger.info(`Plugin started. Scheduler is running`);
    }

    async onStop(): Promise<void> {
        this.scheduler.stopAllJobs();
        await this.logger.info(`Plugin stopped`);
    }
}
