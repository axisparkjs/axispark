import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { ClassRegistry } from '@axisparkjs/di';
import { ExecutionStepsGenerator } from './execution-steps-generator';
import { ExecutionStepType } from './execution-step-type';
import { ExecutionTransport } from '../execution';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        get: jest.fn(),
        getMethod: jest.fn(),
        define: jest.fn(),
        defineMethod: jest.fn(),
    },
    MetadataKeys: {
        EXECUTION_STEP_TARGET: 'EXECUTION_STEP_TARGET',
        EXECUTION_STEP_METHOD: 'EXECUTION_STEP_METHOD',
        EXECUTION_STEP_USE: 'EXECUTION_STEP_USE',
    },
}));

jest.mock('@axisparkjs/di', () => {
    const originalModule = jest.requireActual('@axisparkjs/di');
    return {
        ...originalModule,
        ClassRegistry: {
            getWithMetadata: jest.fn(),
        },
    };
});

describe('ExecutionStepsGenerator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        it('should register global execution steps', () => {
            class GlobalStep {}

            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([
                GlobalStep,
            ]);

            (Metadata.get as jest.Mock)
                // EXECUTION_STEP_TARGET
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Middleware,
                        global: true,
                        priority: 100,
                        transport: ExecutionTransport.All,
                    },
                ])
                // EXECUTION_STEP_METHOD
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Middleware,
                        target: GlobalStep,
                        propertyKey: 'execute',
                    },
                ]);

            ExecutionStepsGenerator.init();

            const steps = ExecutionStepsGenerator.generate({
                target: class Controller {},
                method: 'find',
            });

            expect(steps).toEqual([
                {
                    global: true,
                    priority: 100,
                    transport: ExecutionTransport.All,
                    type: ExecutionStepType.Middleware,
                    target: GlobalStep,
                    propertyKey: 'execute',
                },
            ]);
        });

        it('should ignore non-global execution steps', () => {
            class Step {}

            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([Step]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Guard,
                        global: false,
                        priority: 10,
                        transport: ExecutionTransport.All,
                    },
                ])
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Guard,
                        target: Step,
                        propertyKey: 'check',
                    },
                ]);

            ExecutionStepsGenerator.init();

            const steps = ExecutionStepsGenerator.generate({
                target: class {},
                method: 'find',
            });

            expect(steps).toEqual([]);
        });
    });

    describe('generate', () => {
        beforeEach(() => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([]);
            ExecutionStepsGenerator.init();
        });

        it('should generate local execution steps from @Use', () => {
            class LocalStep {}
            class Controller {}

            (Metadata.get as jest.Mock)
                // class @Use
                .mockReturnValueOnce({
                    targets: [LocalStep],
                })
                // EXECUTION_STEP_TARGET
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Guard,
                        global: false,
                        transport: ExecutionTransport.Http,
                    },
                ])
                // EXECUTION_STEP_METHOD
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Guard,
                        target: LocalStep,
                        propertyKey: 'check',
                    },
                ]);

            (Metadata.getMethod as jest.Mock).mockReturnValue(undefined);

            const result = ExecutionStepsGenerator.generate({
                target: Controller,
                method: 'find',
            });

            expect(result).toEqual([
                {
                    global: false,
                    priority: 0,
                    transport: ExecutionTransport.Http,
                    type: ExecutionStepType.Guard,
                    target: LocalStep,
                    propertyKey: 'check',
                },
            ]);
        });

        it('should merge class and method targets', () => {
            class Step1 {}
            class Step2 {}
            class Controller {}

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    targets: [Step1],
                })
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(undefined);

            (Metadata.getMethod as jest.Mock)
                .mockReturnValueOnce({
                    targets: [Step2],
                });

            const result = ExecutionStepsGenerator.generate({
                target: Controller,
                method: 'find',
            });

            expect(Metadata.getMethod).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_USE,
                Controller,
                'find',
            );

            expect(result).toEqual([]);
        });

        it('should ignore methods with different execution step type', () => {
            class Step {}
            class Controller {}

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    targets: [Step],
                })
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Guard,
                        global: false,
                        transport: ExecutionTransport.All,
                    },
                ])
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Middleware,
                        target: Step,
                        propertyKey: 'execute',
                    },
                ]);

            (Metadata.getMethod as jest.Mock).mockReturnValue(undefined);

            const result = ExecutionStepsGenerator.generate({
                target: Controller,
                method: 'find',
            });

            expect(result).toEqual([]);
        });

        it('should return global and local execution steps', () => {
            class GlobalStep {}
            class LocalStep {}
            class Controller {}

            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([
                GlobalStep,
            ]);

            (Metadata.get as jest.Mock)
                // init - target metadata
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Middleware,
                        global: true,
                        priority: 10,
                        transport: ExecutionTransport.All,
                    },
                ])
                // init - method metadata
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Middleware,
                        target: GlobalStep,
                        propertyKey: 'before',
                    },
                ])
                // generate - @Use
                .mockReturnValueOnce({
                    targets: [LocalStep],
                })
                // generate - target metadata
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Guard,
                        global: false,
                        transport: ExecutionTransport.Http,
                    },
                ])
                // generate - method metadata
                .mockReturnValueOnce([
                    {
                        type: ExecutionStepType.Guard,
                        target: LocalStep,
                        propertyKey: 'check',
                    },
                ]);

            (Metadata.getMethod as jest.Mock).mockReturnValue(undefined);

            ExecutionStepsGenerator.init();

            const result = ExecutionStepsGenerator.generate({
                target: Controller,
                method: 'find',
            });

            expect(result).toHaveLength(2);
            expect(result[0].global).toBe(true);
            expect(result[1].global).toBe(false);
        });
    });
});