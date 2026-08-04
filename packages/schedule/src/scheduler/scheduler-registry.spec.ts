import { SchedulerRegistry } from './scheduler-registry';
import { SchedulerError } from '../errors/scheduler-error';
import { Job, JobType } from '../jobs/job';

describe('SchedulerRegistry', () => {
    let registry: SchedulerRegistry;
    let logger: any;

    beforeEach(() => {
        logger = {
            info: jest.fn(),
            debug: jest.fn()
        };

        registry = new SchedulerRegistry(logger);
    });

    const createJob = (name: string, type: JobType = JobType.Interval): Job =>
        ({
            name,
            type
        }) as Job;

    describe('registerJob', () => {
        it('should register a job', () => {
            const job = createJob('job');

            registry.registerJob(job);

            expect(registry.getJob('job')).toBe(job);
            expect(logger.info).toHaveBeenCalledWith('Registered job job');
        });

        it('should throw when the job already exists', () => {
            const job = createJob('job');

            registry.registerJob(job);

            expect(() => registry.registerJob(job)).toThrow(SchedulerError);

            expect(() => registry.registerJob(job)).toThrow('Job with name "job" is already registered.');
        });
    });

    describe('existsJob', () => {
        it('should return true when the job exists', () => {
            registry.registerJob(createJob('job'));

            expect(registry.existsJob('job')).toBe(true);
        });

        it('should return false when the job does not exist', () => {
            expect(registry.existsJob('missing')).toBe(false);
        });
    });

    describe('getJob', () => {
        it('should return the registered job', () => {
            const job = createJob('job');

            registry.registerJob(job);

            expect(registry.getJob('job')).toBe(job);
        });

        it('should return undefined when the job does not exist', () => {
            expect(registry.getJob('missing')).toBeUndefined();
        });
    });

    describe('getAllJobs', () => {
        beforeEach(() => {
            registry.registerJob(createJob('cron', JobType.Cron));
            registry.registerJob(createJob('interval', JobType.Interval));
            registry.registerJob(createJob('timeout', JobType.Timeout));
        });

        it('should return all jobs', () => {
            expect(registry.getAllJobs()).toHaveLength(3);
        });

        it('should filter jobs by type', () => {
            const jobs = registry.getAllJobs(JobType.Interval);

            expect(jobs).toHaveLength(1);
            expect(jobs[0].name).toBe('interval');
        });

        it('should return an empty array when no jobs match the type', () => {
            expect(registry.getAllJobs(JobType.Date)).toEqual([]);
        });
    });

    describe('removeJob', () => {
        it('should remove a job by name', () => {
            registry.registerJob(createJob('job'));

            registry.removeJob('job');

            expect(registry.existsJob('job')).toBe(false);
            expect(logger.debug).toHaveBeenCalledWith('Removed job job');
        });

        it('should remove a job instance', () => {
            const job = createJob('job');

            registry.registerJob(job);

            registry.removeJob(job);

            expect(registry.existsJob('job')).toBe(false);
            expect(logger.debug).toHaveBeenCalledWith('Removed job job');
        });

        it('should not throw when removing a missing job', () => {
            expect(() => registry.removeJob('missing')).not.toThrow();

            expect(logger.debug).toHaveBeenCalledWith('Removed job missing');
        });
    });
});
