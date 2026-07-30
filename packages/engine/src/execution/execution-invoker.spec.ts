import { ParametersResolver } from '../parameters';
import { PipeExecutor } from '../pipes';
import { ExecutionInvoker } from './execution-invoker';

jest.mock('../parameters', () => ({
    ParametersResolver: {
        resolve: jest.fn(),
    },
}));

jest.mock('../pipes', () => ({
    PipeExecutor: {
        execute: jest.fn(),
    },
}));

describe('ExecutionInvoker', () => {
    let context: any;
    let core: any;
    let container: any;

    beforeEach(() => {
        jest.clearAllMocks();

        container = {
            resolve: jest.fn(),
        };

        core = {
            container,
        };

        context = {};
    });

    function createHandler(method = 'execute') {
        return {
            target: class Test {},
            method,
        };
    }

    it('should invoke the main handler', async () => {
        const execute = jest.fn().mockReturnValue('result');

        container.resolve.mockReturnValue({
            execute,
        });

        (ParametersResolver.resolve as jest.Mock).mockReturnValue(['value']);
        (PipeExecutor.execute as jest.Mock).mockReturnValue(['parsed']);

        const plan = {
            before: [],
            after: [],
            filters: [],
            handler: createHandler(),
        };

        const result = await ExecutionInvoker.invoke(context, core, plan);

        expect(container.resolve).toHaveBeenCalledWith(plan.handler.target);
        expect(ParametersResolver.resolve).toHaveBeenCalledWith(context, plan.handler);
        expect(PipeExecutor.execute).toHaveBeenCalled();
        expect(execute).toHaveBeenCalledWith('parsed');
        expect(result).toBe('result');
    });

    it('should execute before handlers before the main handler', async () => {
        const order: string[] = [];

        class Before {}
        class Main {}

        container.resolve
            .mockReturnValueOnce({
                before: () => order.push('before'),
            })
            .mockReturnValueOnce({
                execute: () => {
                    order.push('main');
                },
            });

        (ParametersResolver.resolve as jest.Mock).mockReturnValue([]);
        (PipeExecutor.execute as jest.Mock).mockReturnValue([]);

        await ExecutionInvoker.invoke(context, core, {
            before: [{ target: Before, method: 'before' }],
            after: [],
            filters: [],
            handler: {
                target: Main,
                method: 'execute',
            },
        });

        expect(order).toEqual(['before', 'main']);
    });

    it('should execute after handlers', async () => {
        const order: string[] = [];

        class Main {}
        class After {}

        container.resolve
            .mockReturnValueOnce({
                execute: () => order.push('main'),
            })
            .mockReturnValueOnce({
                after: () => order.push('after'),
            });

        (ParametersResolver.resolve as jest.Mock).mockReturnValue([]);
        (PipeExecutor.execute as jest.Mock).mockReturnValue([]);

        await ExecutionInvoker.invoke(context, core, {
            before: [],
            after: [{ target: After, method: 'after' }],
            filters: [],
            handler: {
                target: Main,
                method: 'execute',
            },
        });

        expect(order).toEqual(['main', 'after']);
    });

    it('should execute after handlers even when the handler throws', async () => {
        const after = jest.fn();

        class Main {}
        class After {}

        container.resolve
            .mockReturnValueOnce({
                execute: () => {
                    throw new Error('boom');
                },
            })
            .mockReturnValueOnce({
                after,
            });

        (ParametersResolver.resolve as jest.Mock).mockReturnValue([]);
        (PipeExecutor.execute as jest.Mock).mockReturnValue([]);

        await ExecutionInvoker.invoke(context, core, {
            before: [],
            after: [{ target: After, method: 'after' }],
            filters: [],
            handler: {
                target: Main,
                method: 'execute',
            },
        });

        expect(after).toHaveBeenCalled();
    });

    it('should execute the matching filter', async () => {
        class Main {}
        class Filter {}

        container.resolve
            .mockReturnValueOnce({
                execute() {
                    throw new TypeError('boom');
                },
            })
            .mockReturnValueOnce({
                catchError: () => 'handled',
            });

        (ParametersResolver.resolve as jest.Mock).mockReturnValue([]);
        (PipeExecutor.execute as jest.Mock).mockReturnValue([]);

        const result = await ExecutionInvoker.invoke(context, core, {
            before: [],
            after: [],
            handler: {
                target: Main,
                method: 'execute',
            },
            filters: [
                {
                    executionHandler: {
                        target: Filter,
                        method: 'catchError',
                    },
                    acceptedErrors: [TypeError],
                },
            ],
        });

        expect(result).toBe('handled');
        expect(context.error).toBeInstanceOf(TypeError);
    });

    it('should ignore filters that do not accept the error', async () => {
        class Main {}

        container.resolve.mockReturnValue({
            execute() {
                throw new TypeError();
            },
        });

        (ParametersResolver.resolve as jest.Mock).mockReturnValue([]);
        (PipeExecutor.execute as jest.Mock).mockReturnValue([]);

        const result = await ExecutionInvoker.invoke(context, core, {
            before: [],
            after: [],
            handler: {
                target: Main,
                method: 'execute',
            },
            filters: [
                {
                    executionHandler: createHandler('filter'),
                    acceptedErrors: [ReferenceError],
                },
            ],
        });

        expect(result).toBeUndefined();
    });

    it('should continue to the next filter when one returns undefined', async () => {
        class Main {}
        class Filter1 {}
        class Filter2 {}

        container.resolve
            .mockReturnValueOnce({
                execute() {
                    throw new TypeError();
                },
            })
            .mockReturnValueOnce({
                filter: () => undefined,
            })
            .mockReturnValueOnce({
                filter: () => 'handled',
            });

        (ParametersResolver.resolve as jest.Mock).mockReturnValue([]);
        (PipeExecutor.execute as jest.Mock).mockReturnValue([]);

        const result = await ExecutionInvoker.invoke(context, core, {
            before: [],
            after: [],
            handler: {
                target: Main,
                method: 'execute',
            },
            filters: [
                {
                    executionHandler: {
                        target: Filter1,
                        method: 'filter',
                    },
                    acceptedErrors: [TypeError],
                },
                {
                    executionHandler: {
                        target: Filter2,
                        method: 'filter',
                    },
                    acceptedErrors: [TypeError],
                },
            ],
        });

        expect(result).toBe('handled');
    });

    it('should pass pipe executor result to the invoked method', async () => {
        const execute = jest.fn();

        container.resolve.mockReturnValue({
            execute,
        });

        (ParametersResolver.resolve as jest.Mock).mockReturnValue(['a', 'b']);
        (PipeExecutor.execute as jest.Mock).mockReturnValue(['x', 'y']);

        await ExecutionInvoker.invoke(context, core, {
            before: [],
            after: [],
            filters: [],
            handler: createHandler(),
        });

        expect(execute).toHaveBeenCalledWith('x', 'y');
    });
});