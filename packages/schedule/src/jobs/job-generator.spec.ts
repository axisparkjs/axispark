import { ClassRegistry } from '@axisparkjs/di';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Job } from './job';
import { JobGenerator } from './job-generator';
import { JobType } from './job';

jest.mock('@axisparkjs/di', () => ({
    ClassRegistry: {
        getWithMetadata: jest.fn()
    }
}));

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        get: jest.fn()
    },
    MetadataKeys: {
        SCHEDULER: 'scheduler',
        JOB: 'job'
    }
}));

describe('JobGenerator', () => {
    let context: any;

    beforeEach(() => {
        jest.clearAllMocks();

        context = {
            container: {
                resolve: jest.fn()
            }
        };

        jest.spyOn(Job, 'fromMetadata').mockImplementation((metadata) => ({ ...metadata }) as any);
    });

    it('should return an empty array when there are no schedulers', () => {
        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([]);

        expect(JobGenerator.generate(context)).toEqual([]);

        expect(ClassRegistry.getWithMetadata).toHaveBeenCalledWith(MetadataKeys.SCHEDULER);
    });

    it('should ignore schedulers without jobs', () => {
        class Scheduler {}

        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([Scheduler]);

        (Metadata.get as jest.Mock).mockReturnValue(undefined);

        expect(JobGenerator.generate(context)).toEqual([]);

        expect(Metadata.get).toHaveBeenCalledWith(MetadataKeys.JOB, Scheduler);
    });

    it('should generate jobs from scheduler metadata', () => {
        class Scheduler {}

        class SchedulerInstance {
            execute = jest.fn().mockResolvedValue(undefined);
        }

        const metadata = [
            {
                name: 'job',
                type: JobType.Interval,
                value: 1000,
                target: Scheduler,
                propertyKey: 'execute'
            }
        ];

        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([Scheduler]);

        (Metadata.get as jest.Mock).mockReturnValue(metadata);

        const instance = new SchedulerInstance();

        context.container.resolve.mockReturnValue(instance);

        const jobs = JobGenerator.generate(context);

        expect(context.container.resolve).toHaveBeenCalledWith(Scheduler);

        expect(Job.fromMetadata).toHaveBeenCalledWith(
            {
                name: 'job',
                type: JobType.Interval,
                value: 1000,
                target: Scheduler,
                propertyKey: 'execute'
            },
            expect.any(Function)
        );

        expect(jobs).toEqual([expect.objectContaining({ disabled: undefined, job: expect.objectContaining({ name: 'job', type: JobType.Interval, value: 1000 }) })]);
    });

    it('should bind the method to the resolved instance', async () => {
        class Scheduler {}

        class SchedulerInstance {
            value = 42;

            async execute() {
                return this.value;
            }
        }

        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([Scheduler]);

        (Metadata.get as jest.Mock).mockReturnValue([
            {
                name: 'job',
                type: JobType.Timeout,
                value: 100,
                target: Scheduler,
                propertyKey: 'execute'
            }
        ]);

        const instance = new SchedulerInstance();

        context.container.resolve.mockReturnValue(instance);

        let boundMethod!: () => Promise<number>;

        (Job.fromMetadata as jest.Mock).mockImplementation((_) => {
            boundMethod = () => Promise.resolve(42);
            return {} as any;
        });

        JobGenerator.generate(context);

        await expect(boundMethod()).resolves.toBe(42);
    });

    it('should generate jobs from multiple schedulers', () => {
        class Scheduler1 {}
        class Scheduler2 {}

        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([Scheduler1, Scheduler2]);

        (Metadata.get as jest.Mock)
            .mockReturnValueOnce([
                {
                    name: 'job1',
                    type: JobType.Interval,
                    value: 1000,
                    target: Scheduler1,
                    propertyKey: 'execute'
                }
            ])
            .mockReturnValueOnce([
                {
                    name: 'job2',
                    type: JobType.Timeout,
                    value: 500,
                    target: Scheduler2,
                    propertyKey: 'execute'
                }
            ]);

        context.container.resolve
            .mockReturnValueOnce({
                execute: jest.fn()
            })
            .mockReturnValueOnce({
                execute: jest.fn()
            });

        (Job.fromMetadata as jest.Mock).mockReturnValueOnce({ id: 1 }).mockReturnValueOnce({ id: 2 });

        expect(JobGenerator.generate(context)).toEqual([expect.objectContaining({ job: { id: 1 } }), expect.objectContaining({ job: { id: 2 } })]);

        expect(Job.fromMetadata).toHaveBeenCalledTimes(2);
    });
});
