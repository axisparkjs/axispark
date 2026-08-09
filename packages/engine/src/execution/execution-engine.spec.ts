import { ExecutionEngine } from './execution-engine';
import { ExecutionStepsGenerator } from '../execution-steps/execution-steps-generator';
import { ExecutionInvoker } from './execution-invoker';
import { ExecutionTransport } from './execution-transport';
import { ExecutionStepType } from '../execution-steps/execution-step-type';
import { ExecutionStepScope } from '../execution-steps/execution-step-scope';

jest.mock('../execution-steps/execution-steps-generator', () => ({
    ExecutionStepsGenerator: {
        init: jest.fn(),
        generate: jest.fn()
    }
}));

jest.mock('./execution-invoker', () => ({
    ExecutionInvoker: {
        invoke: jest.fn()
    }
}));

describe('ExecutionEngine', () => {
    let engine: ExecutionEngine;

    const handler = {
        target: class TestController {},
        method: 'execute'
    };

    const context: any = {
        transport: ExecutionTransport.All
    };

    const core: any = {
        resultProcessor: {
            process: jest.fn()
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        engine = new ExecutionEngine();
    });

    describe('init', () => {
        it('should initialize execution steps generator', () => {
            engine.init();

            expect(ExecutionStepsGenerator.init).toHaveBeenCalledTimes(1);
        });
    });

    describe('execute', () => {
        it('should generate execution plan the first time', async () => {
            (ExecutionStepsGenerator.generate as jest.Mock).mockReturnValue([]);
            (ExecutionInvoker.invoke as jest.Mock).mockResolvedValue(undefined);

            await engine.execute(context, handler, core);

            expect(ExecutionStepsGenerator.generate).toHaveBeenCalledTimes(1);
            expect(ExecutionInvoker.invoke).toHaveBeenCalledTimes(1);
        });

        it('should reuse cached execution plan', async () => {
            (ExecutionStepsGenerator.generate as jest.Mock).mockReturnValue([]);
            (ExecutionInvoker.invoke as jest.Mock).mockResolvedValue(undefined);

            await engine.execute(context, handler, core);
            await engine.execute(context, handler, core);

            expect(ExecutionStepsGenerator.generate).toHaveBeenCalledTimes(1);
            expect(ExecutionInvoker.invoke).toHaveBeenCalledTimes(2);
        });

        it('should process execution result', async () => {
            (ExecutionStepsGenerator.generate as jest.Mock).mockReturnValue([]);

            const result = 'OK';

            (ExecutionInvoker.invoke as jest.Mock).mockResolvedValue(result);

            await engine.execute(context, handler, core);

            expect(core.resultProcessor.process).toHaveBeenCalledWith(context, handler, result);
        });

        it('should only include steps matching current transport', async () => {
            (ExecutionStepsGenerator.generate as jest.Mock).mockReturnValue([
                {
                    target: class {},
                    propertyKey: 'middleware',
                    global: true,
                    priority: 0,
                    transport: ExecutionTransport.Http,
                    type: ExecutionStepType.Middleware
                },
                {
                    target: class {},
                    propertyKey: 'guard',
                    global: true,
                    priority: 0,
                    transport: ExecutionTransport.All,
                    type: ExecutionStepType.Guard
                },
                {
                    target: class {},
                    propertyKey: 'filter',
                    global: true,
                    priority: 0,
                    transport: ExecutionTransport.All,
                    type: ExecutionStepType.Filter
                }
            ]);

            (ExecutionInvoker.invoke as jest.Mock).mockResolvedValue(undefined);

            await engine.execute(
                {
                    transport: ExecutionTransport.Http
                } as any,
                handler,
                core
            );

            const plan = (ExecutionInvoker.invoke as jest.Mock).mock.calls[0][2];

            expect(plan.before).toHaveLength(2);
        });

        it('should order after interceptors in reverse order', async () => {
            class A {}
            class B {}

            (ExecutionStepsGenerator.generate as jest.Mock).mockReturnValue([
                {
                    target: A,
                    propertyKey: 'a',
                    global: false,
                    priority: 0,
                    transport: ExecutionTransport.All,
                    type: ExecutionStepType.Interceptor,
                    scope: ExecutionStepScope.After
                },
                {
                    target: B,
                    propertyKey: 'b',
                    global: false,
                    priority: 0,
                    transport: ExecutionTransport.All,
                    type: ExecutionStepType.Interceptor,
                    scope: ExecutionStepScope.After
                }
            ]);

            (ExecutionInvoker.invoke as jest.Mock).mockResolvedValue(undefined);

            await engine.execute(context, handler, core);

            const plan = (ExecutionInvoker.invoke as jest.Mock).mock.calls[0][2];

            expect(plan.after).toEqual([
                { target: B, method: 'b' },
                { target: A, method: 'a' }
            ]);
        });

        it('should order global middleware by descending priority', async () => {
            class High {}
            class Low {}

            (ExecutionStepsGenerator.generate as jest.Mock).mockReturnValue([
                {
                    target: Low,
                    propertyKey: 'low',
                    global: true,
                    priority: 1,
                    transport: ExecutionTransport.All,
                    type: ExecutionStepType.Middleware
                },
                {
                    target: High,
                    propertyKey: 'high',
                    global: true,
                    priority: 10,
                    transport: ExecutionTransport.All,
                    type: ExecutionStepType.Middleware
                }
            ]);

            (ExecutionInvoker.invoke as jest.Mock).mockResolvedValue(undefined);

            await engine.execute(context, handler, core);

            const plan = (ExecutionInvoker.invoke as jest.Mock).mock.calls[0][2];

            expect(plan.before).toEqual([
                { target: High, method: 'high' },
                { target: Low, method: 'low' }
            ]);
        });
    });
});
