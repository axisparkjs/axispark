import { SchedulePlugin } from './schedule-plugin';
import { JobGenerator } from '../jobs/job-generator';
import { SCHEDULE_LOGGER } from '../di/tokens';

describe('SchedulePlugin', () => {
    let plugin: SchedulePlugin;
    let jobGenerator: jest.Mocked<JobGenerator>;
    let logger: any;
    let scheduler: any;
    let context: any;
    const jobs = [
        { name: 'job1', type: 'type1', initiallyDisabled: false },
        { name: 'job2', type: 'type2', initiallyDisabled: true }
    ];

    beforeEach(() => {
        logger = {
            child: jest.fn().mockReturnThis(),
            info: jest.fn().mockResolvedValue(undefined),
            debug: jest.fn().mockResolvedValue(undefined)
        };

        scheduler = {
            registerJobs: jest.fn(),
            startAllJobs: jest.fn(),
            stopAllJobs: jest.fn(),
            startJob: jest.fn()
        };

        jobGenerator = {
            generate: jest.fn()
        } as any;

        context = {
            container: {
                bind: jest.fn()
            }
        };

        (jobGenerator.generate as jest.Mock).mockReturnValue(jobs);
        plugin = new SchedulePlugin(logger, jobGenerator, scheduler);
    });

    describe('onRegister', () => {
        it('should resolve the logger', async () => {
            await plugin.onRegister(context);

            expect(logger.child).toHaveBeenCalledWith('SchedulePlugin');
        });

        it('should register container bindings', async () => {
            await plugin.onRegister(context);

            expect(context.container.bind).toHaveBeenCalledWith({
                token: SCHEDULE_LOGGER,
                useValue: logger
            });
        });

        it('should initialize the scheduler', async () => {
            await plugin.onRegister(context);

            expect(jobGenerator.generate).toHaveBeenCalled();
            expect(scheduler.registerJobs).toHaveBeenCalledWith(jobs);
        });

        it('should log plugin registration', async () => {
            await plugin.onRegister(context);

            expect(logger.debug).toHaveBeenCalledWith('Registered job job1 of type type1 ');
            expect(logger.debug).toHaveBeenCalledWith('Registered job job2 of type type2 (initially disabled)');
            expect(logger.info).toHaveBeenCalledWith('Plugin registered');
        });
    });

    describe('onStart', () => {
        beforeEach(async () => {
            await plugin.onRegister(context);
            jest.clearAllMocks();
        });

        it('should start all jobs that are not disabled', async () => {
            await plugin.onStart();

            expect(scheduler.startAllJobs).toHaveBeenCalledWith(true);
        });

        it('should log plugin startup', async () => {
            await plugin.onStart();

            expect(logger.info).toHaveBeenCalledWith('Plugin started. Scheduler is running');
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

            expect(logger.info).toHaveBeenCalledWith('Plugin stopped');
        });
    });
});
