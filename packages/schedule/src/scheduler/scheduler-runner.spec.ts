import { SchedulerRunner } from './scheduler-runner';
import { JobDefinition } from '../jobs/job-definition';

describe('SchedulerRunner', () => {
    let runner: SchedulerRunner;

    beforeEach(() => {
        jest.useFakeTimers();

        runner = new SchedulerRunner();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    const createJob = (name = 'job'): jest.Mocked<JobDefinition> =>
        ({
            name,
            getNextExecutionTime: jest.fn(),
            execute: jest.fn()
        }) as any;

    describe('start', () => {
        it('should schedule a job', () => {
            const job = createJob();
            job.getNextExecutionTime.mockReturnValue(new Date(Date.now() + 1000));

            runner.start(job);

            expect(runner.isRunning(job)).toBe(true);
        });

        it('should not schedule a running job twice', () => {
            const job = createJob();
            job.getNextExecutionTime.mockReturnValue(new Date(Date.now() + 1000));

            runner.start(job);
            runner.start(job);

            expect(job.getNextExecutionTime).toHaveBeenCalledTimes(1);
        });

        it('should ignore jobs without a next execution time', () => {
            const job = createJob();
            job.getNextExecutionTime.mockReturnValue(undefined);

            runner.start(job);

            expect(runner.isRunning(job)).toBe(false);
        });

        it('should ignore jobs scheduled in the past', () => {
            const job = createJob();
            job.getNextExecutionTime.mockReturnValue(new Date(Date.now() - 1000));

            runner.start(job);

            expect(runner.isRunning(job)).toBe(false);
        });
    });

    describe('stop', () => {
        it('should stop a running job', () => {
            const job = createJob();
            job.getNextExecutionTime.mockReturnValue(new Date(Date.now() + 1000));

            runner.start(job);

            expect(runner.isRunning(job)).toBe(true);

            runner.stop(job);

            expect(runner.isRunning(job)).toBe(false);
        });

        it('should not fail when stopping a non-running job', () => {
            const job = createJob();

            expect(() => runner.stop(job)).not.toThrow();
        });
    });

    describe('execution', () => {
        it('should execute the scheduled job', async () => {
            const job = createJob();

            job.getNextExecutionTime.mockReturnValue(new Date(Date.now() + 1000));

            job.execute.mockResolvedValue(undefined);

            runner.start(job);

            await jest.advanceTimersByTimeAsync(1000);

            expect(job.execute).toHaveBeenCalledTimes(1);
            expect(runner.isRunning(job)).toBe(false);
        });

        it('should handle execution errors', async () => {
            const job = createJob();

            job.getNextExecutionTime.mockReturnValue(new Date(Date.now() + 1000));

            const error = new Error('boom');

            job.execute.mockRejectedValue(error);

            runner.start(job);

            await jest.advanceTimersByTimeAsync(1000);
        });

        it('should reschedule enabled jobs', async () => {
            const job = createJob();

            job.getNextExecutionTime.mockReturnValueOnce(new Date(Date.now() + 1000)).mockReturnValueOnce(new Date(Date.now() + 2000));

            job.execute.mockResolvedValue(undefined);

            runner.start(job);

            await jest.advanceTimersByTimeAsync(1000);

            expect(job.getNextExecutionTime).toHaveBeenCalledTimes(2);
            expect(runner.isRunning(job)).toBe(true);
        });

        it('should not reschedule a stopped job', async () => {
            const job = createJob();

            job.getNextExecutionTime.mockReturnValue(new Date(Date.now() + 1000));

            job.execute.mockImplementation(async () => {
                runner.stop(job);
            });

            runner.start(job);

            await jest.advanceTimersByTimeAsync(1000);

            expect(job.getNextExecutionTime).toHaveBeenCalledTimes(1);
            expect(runner.isRunning(job)).toBe(false);
        });
    });

    describe('startAll', () => {
        it('should start every job', () => {
            const job1 = createJob('job1');
            const job2 = createJob('job2');

            job1.getNextExecutionTime.mockReturnValue(new Date(Date.now() + 1000));

            job2.getNextExecutionTime.mockReturnValue(new Date(Date.now() + 1000));

            runner.startAll([job1, job2]);

            expect(runner.isRunning(job1)).toBe(true);
            expect(runner.isRunning(job2)).toBe(true);
        });
    });

    describe('stopAll', () => {
        it('should stop every job', () => {
            const job1 = createJob('job1');
            const job2 = createJob('job2');

            job1.getNextExecutionTime.mockReturnValue(new Date(Date.now() + 1000));

            job2.getNextExecutionTime.mockReturnValue(new Date(Date.now() + 1000));

            runner.startAll([job1, job2]);

            runner.stopAll([job1, job2]);

            expect(runner.isRunning(job1)).toBe(false);
            expect(runner.isRunning(job2)).toBe(false);
        });
    });
});
