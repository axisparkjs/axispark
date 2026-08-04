import { Logger } from '@axisparkjs/logger';
import { Cron, Timeout, CronExpression, Scheduler, SchedulerService, Interval, DateSchedule, IntervalJob } from '@axisparkjs/schedule';

@Scheduler()
export class SchedulerExample {
    constructor(
        private readonly logger: Logger,
        private readonly schedulerService: SchedulerService
    ) {}

    @Cron(CronExpression.EverySecond)
    async everySecondJob() {
        await this.logger.trace('Cron job executed');
    }

    @Cron({ cronExpression: '*/2 * * * * *', name: 'every2SecondsJob', timeZone: 'UTC' })
    async every2SecondsJob() {
        await this.logger.trace('Every 2 seconds job executed');
    }

    @Cron({ cronExpression: '*/5 * * * * *', name: 'every5SecondsJob', disabled: true })
    async every5SecondsJob() {
        await this.logger.trace('Every 5 seconds job executed');
    }

    @Interval({ interval: 3000, name: 'every3SecondsIntervalJob' })
    async every3SecondsIntervalJob() {
        await this.logger.trace('Every 3 seconds interval job executed');
    }

    @Interval({ interval: 7000, name: 'every7SecondsIntervalJob' })
    async every7SecondsIntervalJob() {
        await this.logger.trace('Every 7 seconds interval job executed');
    }

    @DateSchedule(new Date(Date.now() + 3000))
    async dateJob() {
        await this.logger.trace('Date job executed');
        this.schedulerService.startJob(
            new IntervalJob('everySecondIntervalJob', 1000, async () => {
                await this.logger.trace('Every second interval job executed');
            })
        );
    }

    @Timeout(2000)
    async timeout2SecondsJob() {
        this.schedulerService.stopJob('every3SecondsIntervalJob');
        await this.logger.trace('Timeout 2 seconds job executed');
    }

    @Timeout(6000)
    async timeout6SecondsJob() {
        this.schedulerService.stopAllJobs();
        await this.logger.trace('Timeout 6 seconds job executed');
    }
}
