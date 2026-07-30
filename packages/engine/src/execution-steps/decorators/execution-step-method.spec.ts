import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Handle, Check, Before, After, Catch } from './execution-step-method';
import { ExecutionStepType } from '../execution-step-type';
import { ExecutionStepScope } from '../execution-step-scope';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        get: jest.fn(),
        define: jest.fn()
    },
    MetadataKeys: {
        EXECUTION_STEP_METHOD: 'EXECUTION_STEP_METHOD'
    }
}));

describe('Execution step decorators', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (Metadata.get as jest.Mock).mockReturnValue([]);
    });

    describe.each([
        [
            'Handle',
            Handle,
            {
                type: ExecutionStepType.Middleware
            }
        ],
        [
            'Check',
            Check,
            {
                type: ExecutionStepType.Guard
            }
        ],
        [
            'Before',
            Before,
            {
                type: ExecutionStepType.Interceptor,
                scope: ExecutionStepScope.Before
            }
        ],
        [
            'After',
            After,
            {
                type: ExecutionStepType.Interceptor,
                scope: ExecutionStepScope.After
            }
        ]
    ])('%s', (_, decoratorFactory, expected) => {
        it('should register execution step metadata', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class TestClass {
                @decoratorFactory()
                execute() {}
            }

            expect(Metadata.get).toHaveBeenCalledWith(MetadataKeys.EXECUTION_STEP_METHOD, TestClass.prototype);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_METHOD,
                [
                    expect.objectContaining({
                        ...expected,
                        target: TestClass,
                        propertyKey: 'execute'
                    })
                ],
                TestClass.prototype
            );
        });

        it('should append existing metadata', () => {
            (Metadata.get as jest.Mock).mockReturnValue([
                {
                    propertyKey: 'existing'
                }
            ]);

            class TestClass {
                @decoratorFactory()
                execute() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_METHOD,
                [
                    {
                        propertyKey: 'existing'
                    },
                    expect.objectContaining({
                        ...expected,
                        target: TestClass,
                        propertyKey: 'execute'
                    })
                ],
                TestClass.prototype
            );
        });
    });

    describe('Catch', () => {
        it('should register accepted errors', () => {
            class TestClass {
                @Catch(TypeError, RangeError)
                execute() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_METHOD,
                [
                    expect.objectContaining({
                        type: ExecutionStepType.Filter,
                        acceptedErrors: [TypeError, RangeError],
                        target: TestClass,
                        propertyKey: 'execute'
                    })
                ],
                TestClass.prototype
            );
        });

        it('should support no accepted errors', () => {
            class TestClass {
                @Catch()
                execute() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_METHOD,
                [
                    expect.objectContaining({
                        type: ExecutionStepType.Filter,
                        acceptedErrors: []
                    })
                ],
                TestClass.prototype
            );
        });
    });
});
