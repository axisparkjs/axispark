import { Constructor } from '@axisparkjs/di';
import { CronJob, DateJob, IntervalJob, Job, JobType, TimeoutJob } from './job';

import { CronJobTrigger, DateJobTrigger, IntervalJobTrigger, TimeoutJobTrigger } from './job-trigger';

jest.mock('./job-trigger', () => ({
    CronJobTrigger: jest.fn(),
    IntervalJobTrigger: jest.fn(),
    DateJobTrigger: jest.fn(),
    TimeoutJobTrigger: jest.fn()
}));

describe('Job.fromMetadata', () => {
    const execute = jest.fn().mockResolvedValue(undefined);

    it.each([
        [JobType.Cron, '* * * * *', CronJob],
        [JobType.Interval, 1000, IntervalJob],
        [JobType.Date, new Date(Date.now() + 10000), DateJob],
        [JobType.Timeout, 5000, TimeoutJob]
    ])('should create a %s job', (type, value, expected) => {
        const job = Job.fromMetadata({ name: 'job', disabled: false, value, type, propertyKey: 'execute', target: {} as Constructor }, execute);

        expect(job).toBeInstanceOf(expected);
    });

    it('should throw for an unsupported type', () => {
        expect(() => Job.fromMetadata({ name: 'job', disabled: false, value: 0, type: 'invalid' as JobType, propertyKey: 'execute', target: {} as Constructor }, execute)).toThrow(
            'Unsupported job type: invalid'
        );
    });
});

describe('CronJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (CronJobTrigger as jest.Mock).mockImplementation(() => ({
            getNextExecutionTime: jest.fn()
        }));
    });

    it('should create a cron trigger', () => {
        const execute = jest.fn();

        const job = new CronJob('cron', '* * * * *', execute);

        expect(job.type).toBe(JobType.Cron);
        expect(CronJobTrigger).toHaveBeenCalledWith('* * * * *', undefined);
    });

    it('should update the cron expression', () => {
        const execute = jest.fn();

        const job = new CronJob('cron', '* * * * *', execute);

        (CronJobTrigger as jest.Mock).mockClear();

        job.updateCronExpression('0 * * * *', 'UTC');

        expect(CronJobTrigger).toHaveBeenCalledWith('0 * * * *', 'UTC');
    });
});

describe('IntervalJob', () => {
    beforeEach(() => {
        (IntervalJobTrigger as jest.Mock).mockImplementation(() => ({
            getNextExecutionTime: jest.fn()
        }));
    });

    it('should update the interval', () => {
        const job = new IntervalJob('interval', 1000, jest.fn());

        (IntervalJobTrigger as jest.Mock).mockClear();

        job.updateInterval(5000);

        expect(IntervalJobTrigger).toHaveBeenCalledWith(5000);
    });
});

describe('DateJob', () => {
    beforeEach(() => {
        (DateJobTrigger as jest.Mock).mockImplementation(() => ({
            getNextExecutionTime: jest.fn()
        }));
    });

    it('should update the date', () => {
        const date = new Date(Date.now() + 10000);

        const job = new DateJob('date', date, jest.fn());

        const newDate = new Date(Date.now() + 20000);

        (DateJobTrigger as jest.Mock).mockClear();

        job.updateDate(newDate);

        expect(DateJobTrigger).toHaveBeenCalledWith(newDate);
    });
});

describe('TimeoutJob', () => {
    beforeEach(() => {
        (TimeoutJobTrigger as jest.Mock).mockImplementation(() => ({
            getNextExecutionTime: jest.fn()
        }));
    });

    it('should update the timeout', () => {
        const job = new TimeoutJob('timeout', 1000, jest.fn());

        (TimeoutJobTrigger as jest.Mock).mockClear();

        job.updateTimeout(5000);

        expect(TimeoutJobTrigger).toHaveBeenCalledWith(5000);
    });
});

describe('Job execution', () => {
    beforeEach(() => {
        (IntervalJobTrigger as jest.Mock).mockImplementation(() => ({
            getNextExecutionTime: jest.fn().mockReturnValue('next')
        }));
    });

    it('should execute the job', async () => {
        const execute = jest.fn().mockResolvedValue(undefined);

        const job = new IntervalJob('job', 1000, execute);

        expect(job.getLastExecutionTime()).toBeUndefined();

        await job.execute();

        expect(execute).toHaveBeenCalledTimes(1);
        expect(job.getLastExecutionTime()).toBeInstanceOf(Date);
    });

    it('should delegate next execution time to the trigger', () => {
        const trigger = {
            getNextExecutionTime: jest.fn().mockReturnValue('next')
        };

        (IntervalJobTrigger as jest.Mock).mockImplementation(() => trigger);

        const job = new IntervalJob('job', 1000, jest.fn());

        expect(job.getNextExecutionTime()).toBe('next');

        expect(trigger.getNextExecutionTime).toHaveBeenCalledWith(undefined);
    });

    it('should pass the last execution time to the trigger', async () => {
        const trigger = {
            getNextExecutionTime: jest.fn()
        };

        (IntervalJobTrigger as jest.Mock).mockImplementation(() => trigger);

        const job = new IntervalJob('job', 1000, jest.fn().mockResolvedValue(undefined));

        await job.execute();

        const lastExecution = job.getLastExecutionTime();

        job.getNextExecutionTime();

        expect(trigger.getNextExecutionTime).toHaveBeenCalledWith(lastExecution);
    });
});
