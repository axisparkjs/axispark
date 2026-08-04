import { Logger } from '@axisparkjs/logger';
import { SchedulePlugin } from './schedule-plugin';
import { SchedulerService } from '../scheduler';
import { JobGenerator } from '../jobs/job-generator';
import { SCHEDULE_LOGGER } from '../di/tokens';

jest.mock('../jobs/job-generator', () => ({
    JobGenerator: {
        generate: jest.fn()
    }
}));

describe('SchedulePlugin', () => {
    let plugin: SchedulePlugin;

    let logger: any;
    let childLogger: any;
    let scheduler: any;
    let context: any;

    beforeEach(() => {
        childLogger = {
            info: jest.fn().mockResolvedValue(undefined)
        };

        logger = {
            child: jest.fn().mockReturnValue(childLogger)
        };

        scheduler = {
            registerJobs: jest.fn(),
            startAllJobs: jest.fn(),
            stopAllJobs: jest.fn(),
            startJob: jest.fn()
        };

        context = {
            container: {
                resolve: jest.fn((token: any) => {
                    if (token === Logger) return logger;
                    if (token === SchedulerService) return scheduler;
                }),
                bind: jest.fn()
            }
        };

        (JobGenerator.generate as jest.Mock).mockReturnValue([
            { job: 'job1', disabled: false },
            { job: 'job2', disabled: true }
        ]);

        plugin = new SchedulePlugin();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('onRegister', () => {
        it('should resolve the logger', async () => {
            await plugin.onRegister(context);

            expect(context.container.resolve).toHaveBeenCalledWith(Logger);
            expect(logger.child).toHaveBeenCalledWith('SchedulePlugin');
        });

        it('should register container bindings', async () => {
            await plugin.onRegister(context);

            expect(context.container.bind).toHaveBeenCalledWith({
                token: SCHEDULE_LOGGER,
                useValue: childLogger
            });
        });

        it('should initialize the scheduler', async () => {
            await plugin.onRegister(context);

            expect(context.container.resolve).toHaveBeenCalledWith(SchedulerService);

            expect(JobGenerator.generate).toHaveBeenCalledWith(context);

            expect(scheduler.registerJobs).toHaveBeenCalledWith([
                { job: 'job1', start: false },
                { job: 'job2', start: false }
            ]);
        });

        it('should log plugin registration', async () => {
            await plugin.onRegister(context);

            expect(childLogger.info).toHaveBeenCalledWith('Plugin registered');
        });
    });

    describe('onStart', () => {
        beforeEach(async () => {
            await plugin.onRegister(context);
            jest.clearAllMocks();
        });

        it('should start all jobs that are not disabled', async () => {
            await plugin.onStart();

            expect(scheduler.startJob).toHaveBeenCalledWith('job1');
            expect(scheduler.startJob).not.toHaveBeenCalledWith('job2');
        });

        it('should log plugin startup', async () => {
            await plugin.onStart();

            expect(childLogger.info).toHaveBeenCalledWith('Plugin started. Scheduler is running');
        });
    });

    describe('onStop', () => {
        beforeEach(async () => {
            await plugin.onRegister(context);
            jest.clearAllMocks();
        });

        it('should stop all jobs', async () => {
            await plugin.onStop();

            expect(scheduler.stopAllJobs).toHaveBeenCalled();
        });

        it('should log plugin shutdown', async () => {
            await plugin.onStop();

            expect(childLogger.info).toHaveBeenCalledWith('Plugin stopped');
        });
    });
});
