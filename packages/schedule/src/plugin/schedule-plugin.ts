import { AxiSparkContext, Plugin } from '@axisparkjs/core';
import { Injectable } from '@axisparkjs/di';
import { SCHEDULE_LOGGER } from '../di/tokens';
import { Logger } from '@axisparkjs/logger';
import { SchedulerService } from '../scheduler';
import { JobGenerator } from '../jobs/job-generator';

@Injectable()
export class SchedulePlugin extends Plugin {
    private context: AxiSparkContext;

    constructor(
        private logger: Logger,
        private readonly jobGenerator: JobGenerator,
        private readonly scheduler: SchedulerService
    ) {
        super();
    }

    async onRegister(context: AxiSparkContext): Promise<void> {
        this.context = context;
        this.logger = this.logger.child('SchedulePlugin');

        this.registerContainerBindings();
        await this.initializeScheduler();

        await this.logger.info(`Plugin registered`);
    }

    private registerContainerBindings(): void {
        this.context.container.bind({ token: SCHEDULE_LOGGER, useValue: this.logger });
    }

    private async initializeScheduler(): Promise<void> {
        const jobs = await this.jobGenerator.generate(this.context);
        jobs.forEach((job) => {
            this.logger.debug(`Registered job ${job.name} of type ${job.type} ${job.initiallyDisabled ? '(initially disabled)' : ''}`);
        });
        this.scheduler.registerJobs(jobs);
    }

    async onStart(): Promise<void> {
        this.scheduler.startAllJobs(true);
        await this.logger.info(`Plugin started. Scheduler is running`);
    }

    async onStop(): Promise<void> {
        this.scheduler.stopAllJobs();
        await this.logger.info(`Plugin stopped`);
    }
}
