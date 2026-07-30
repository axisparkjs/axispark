import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';
import {
    Middleware,
    Guard,
    Interceptor,
    Filter,
} from './execution-step-target';
import { ExecutionStepType } from '../execution-step-type';
import { ExecutionTransport } from '../../execution';
import { ExecutionPriority } from '../../execution';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        get: jest.fn(),
        define: jest.fn(),
    },
    MetadataKeys: {
        EXECUTION_STEP_TARGET: 'EXECUTION_STEP_TARGET',
        INJECTABLE: 'INJECTABLE',
    },
}));

jest.mock('@axisparkjs/di', () => {
    const originalModule = jest.requireActual('@axisparkjs/di');
    return {
        ...originalModule,
        Constructable: jest.fn(() => jest.fn()),
    };
});

describe('Execution step target decorators', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (Metadata.get as jest.Mock).mockReturnValue([]);
    });

    describe.each([
        ['Middleware', Middleware, ExecutionStepType.Middleware],
        ['Guard', Guard, ExecutionStepType.Guard],
        ['Interceptor', Interceptor, ExecutionStepType.Interceptor],
        ['Filter', Filter, ExecutionStepType.Filter],
    ])('%s', (_, decoratorFactory, type) => {
        it('should register execution step target metadata', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);
            
            @decoratorFactory()
            class TestClass {}


            expect(Constructable).toHaveBeenCalledWith(
                MetadataKeys.INJECTABLE,
            );

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_TARGET,
                [
                    {
                        type,
                        transport: ExecutionTransport.All,
                        global: false,
                        priority: ExecutionPriority.Normal,
                    },
                ],
                TestClass,
            );
        });

        it('should append existing metadata', () => {
            (Metadata.get as jest.Mock).mockReturnValue([
                {
                    type: 'existing',
                },
            ]);

            @decoratorFactory()
            class TestClass {}

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_TARGET,
                [
                    {
                        type: 'existing',
                    },
                    {
                        type,
                        transport: ExecutionTransport.All,
                        global: false,
                        priority: ExecutionPriority.Normal,
                    },
                ],
                TestClass,
            );
        });

        it('should use custom configuration', () => {
            @decoratorFactory({
                transport: ExecutionTransport.Http,
                global: true,
                priority: 123,
            })
            class TestClass {}

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_TARGET,
                [
                    {
                        type,
                        transport: ExecutionTransport.Http,
                        global: true,
                        priority: 123,
                    },
                ],
                TestClass,
            );
        });
    });
});