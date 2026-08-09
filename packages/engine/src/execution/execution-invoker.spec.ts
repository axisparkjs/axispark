import { ParametersResolver } from '../parameters';
import { PipeExecutor } from '../pipes';
import { ExecutionInvoker } from './execution-invoker';

jest.mock('../parameters', () => ({
    ParametersResolver: {
        resolve: jest.fn()
    }
}));

jest.mock('../pipes', () => ({
    PipeExecutor: {
        execute: jest.fn()
    }
}));

describe('ExecutionInvoker', () => {
    let context: any;
    let core: any;
    let scope: any;
    let container: any;

    beforeEach(() => {
        jest.clearAllMocks();

        container = {
            resolve: jest.fn()
        };

        core = {
            container,
            timeoutProcessor: undefined
        };

        scope = {
            'child-container': true
        };

        context = {
            scope
        };

        (ParametersResolver.resolve as jest.Mock).mockReturnValue([]);
        (PipeExecutor.execute as jest.Mock).mockReturnValue([]);
    });

    function createHandler(method = 'execute') {
        return {
            target: class Test {},
            method
        };
    }

    function createPlan(overrides: any = {}) {
        return {
            before: [],
            after: [],
            filters: [],
            handler: createHandler(),
            ...overrides
        };
    }

    describe('invoke', () => {
        it('should invoke the main handler', async () => {
            const execute = jest.fn().mockReturnValue('result');

            const handler = createHandler();

            container.resolve.mockReturnValue({
                execute
            });

            (ParametersResolver.resolve as jest.Mock).mockReturnValue(['value']);
            (PipeExecutor.execute as jest.Mock).mockReturnValue(['parsed']);

            const plan = createPlan({
                handler
            });

            const result = await ExecutionInvoker.invoke(context, core, plan);

            expect(container.resolve).toHaveBeenCalledWith(handler.target, scope);

            expect(ParametersResolver.resolve).toHaveBeenCalledWith(context, handler);

            expect(PipeExecutor.execute).toHaveBeenCalledWith(
                {
                    ...context,
                    args: ['value']
                },
                handler,
                core
            );

            expect(execute).toHaveBeenCalledWith('parsed');
            expect(result).toBe('result');
        });

        it('should execute before handlers before the main handler', async () => {
            const order: string[] = [];

            class Before {}
            class Main {}

            container.resolve
                .mockReturnValueOnce({
                    before: () => order.push('before')
                })
                .mockReturnValueOnce({
                    execute: () => order.push('main')
                });

            const plan = createPlan({
                before: [
                    {
                        target: Before,
                        method: 'before'
                    }
                ],
                handler: {
                    target: Main,
                    method: 'execute'
                }
            });

            await ExecutionInvoker.invoke(context, core, plan);

            expect(order).toEqual(['before', 'main']);
        });

        it('should execute after handlers', async () => {
            const order: string[] = [];

            class Main {}
            class After {}

            container.resolve
                .mockReturnValueOnce({
                    execute: () => order.push('main')
                })
                .mockReturnValueOnce({
                    after: () => order.push('after')
                });

            const plan = createPlan({
                after: [
                    {
                        target: After,
                        method: 'after'
                    }
                ],
                handler: {
                    target: Main,
                    method: 'execute'
                }
            });

            await ExecutionInvoker.invoke(context, core, plan);

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
                    }
                })
                .mockReturnValueOnce({
                    after
                });

            const plan = createPlan({
                after: [
                    {
                        target: After,
                        method: 'after'
                    }
                ],
                handler: {
                    target: Main,
                    method: 'execute'
                }
            });

            await ExecutionInvoker.invoke(context, core, plan);

            expect(context.error).toEqual(new Error('boom'));
            expect(after).toHaveBeenCalled();
        });

        it('should execute the matching filter', async () => {
            class Main {}
            class Filter {}

            const error = new TypeError('boom');

            container.resolve
                .mockReturnValueOnce({
                    execute() {
                        throw error;
                    }
                })
                .mockReturnValueOnce({
                    catchError: () => 'handled'
                });

            const filterHandler = {
                target: Filter,
                method: 'catchError'
            };

            const plan = createPlan({
                handler: {
                    target: Main,
                    method: 'execute'
                },
                filters: [
                    {
                        executionHandler: filterHandler,
                        acceptedErrors: [TypeError]
                    }
                ]
            });

            const result = await ExecutionInvoker.invoke(context, core, plan);

            expect(context.error).toBe(error);
            expect(result).toBe('handled');

            expect(container.resolve).toHaveBeenNthCalledWith(2, Filter, scope);
        });

        it('should ignore filters that do not accept the error', async () => {
            class Main {}
            class Filter {}

            const error = new TypeError();

            const execute = jest.fn(() => {
                throw error;
            });

            container.resolve.mockReturnValue({
                execute
            });

            const filterHandler = {
                target: Filter,
                method: 'filter'
            };

            const plan = createPlan({
                handler: {
                    target: Main,
                    method: 'execute'
                },
                filters: [
                    {
                        executionHandler: filterHandler,
                        acceptedErrors: [ReferenceError]
                    }
                ]
            });

            const result = await ExecutionInvoker.invoke(context, core, plan);

            expect(result).toBeUndefined();
            expect(context.error).toBe(error);
            expect(container.resolve).toHaveBeenCalledTimes(1);
        });

        it('should continue to the next filter when one returns undefined', async () => {
            class Main {}
            class Filter1 {}
            class Filter2 {}

            container.resolve
                .mockReturnValueOnce({
                    execute() {
                        throw new TypeError();
                    }
                })
                .mockReturnValueOnce({
                    filter: () => undefined
                })
                .mockReturnValueOnce({
                    filter: () => 'handled'
                });

            const plan = createPlan({
                handler: {
                    target: Main,
                    method: 'execute'
                },
                filters: [
                    {
                        executionHandler: {
                            target: Filter1,
                            method: 'filter'
                        },
                        acceptedErrors: [TypeError]
                    },
                    {
                        executionHandler: {
                            target: Filter2,
                            method: 'filter'
                        },
                        acceptedErrors: [TypeError]
                    }
                ]
            });

            const result = await ExecutionInvoker.invoke(context, core, plan);

            expect(result).toBe('handled');
            expect(container.resolve).toHaveBeenCalledTimes(3);
        });

        it('should pass pipe executor result to the invoked method', async () => {
            const execute = jest.fn();

            const handler = createHandler();

            container.resolve.mockReturnValue({
                execute
            });

            (ParametersResolver.resolve as jest.Mock).mockReturnValue(['a', 'b']);

            (PipeExecutor.execute as jest.Mock).mockReturnValue(['x', 'y']);

            await ExecutionInvoker.invoke(context, core, createPlan({ handler }));

            expect(execute).toHaveBeenCalledWith('x', 'y');
        });
    });

    describe('timeout', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should execute normally when timeoutProcessor is not defined', async () => {
            const execute = jest.fn().mockReturnValue('result');

            container.resolve.mockReturnValue({
                execute
            });

            const result = await ExecutionInvoker.invoke(context, core, createPlan());

            expect(execute).toHaveBeenCalled();
            expect(result).toBe('result');
        });

        it('should execute normally when timeout is zero', async () => {
            const execute = jest.fn().mockReturnValue('result');

            container.resolve.mockReturnValue({
                execute
            });

            core.timeoutProcessor = {
                time: 0,
                process: jest.fn()
            };

            const result = await ExecutionInvoker.invoke(context, core, createPlan());

            expect(result).toBe('result');
            expect(core.timeoutProcessor.process).not.toHaveBeenCalled();
        });

        it('should execute normally when timeout is negative', async () => {
            const execute = jest.fn().mockReturnValue('result');

            container.resolve.mockReturnValue({
                execute
            });

            core.timeoutProcessor = {
                time: -1,
                process: jest.fn()
            };

            const result = await ExecutionInvoker.invoke(context, core, createPlan());

            expect(result).toBe('result');
            expect(core.timeoutProcessor.process).not.toHaveBeenCalled();
        });

        it('should return the handler result before the timeout', async () => {
            const execute = jest.fn().mockReturnValue('result');

            container.resolve.mockReturnValue({
                execute
            });

            core.timeoutProcessor = {
                time: 1000,
                process: jest.fn().mockReturnValue('timeout')
            };

            const promise = await ExecutionInvoker.invoke(context, core, createPlan());

            expect(execute).toHaveBeenCalled();
            await expect(promise).toBe('result');
            expect(core.timeoutProcessor.process).not.toHaveBeenCalled();
        });

        it('should process the timeout when the handler takes too long', async () => {
            let resolveExecution!: () => void;

            const execute = jest.fn(
                () =>
                    new Promise<void>((resolve) => {
                        resolveExecution = resolve;
                    })
            );

            container.resolve.mockReturnValue({
                execute
            });

            const process = jest.fn().mockReturnValue('timeout');

            core.timeoutProcessor = {
                time: 1000,
                process
            };

            const promise = ExecutionInvoker.invoke(context, core, createPlan());

            await Promise.resolve();

            jest.advanceTimersByTime(1000);

            await expect(promise).resolves.toBe('timeout');

            expect(process).toHaveBeenCalledTimes(1);

            resolveExecution();
        });

        it('should execute after handlers when timeout processor wins', async () => {
            const after = jest.fn();

            container.resolve
                .mockReturnValueOnce({
                    execute: () => new Promise(() => undefined)
                })
                .mockReturnValueOnce({
                    after
                });

            core.timeoutProcessor = {
                time: 1000,
                process: jest.fn().mockReturnValue('timeout')
            };

            const promise = ExecutionInvoker.invoke(
                context,
                core,
                createPlan({
                    after: [
                        {
                            target: class After {},
                            method: 'after'
                        }
                    ]
                })
            );

            jest.advanceTimersByTime(1000);

            await expect(promise).resolves.toBe('timeout');
            expect(after).toHaveBeenCalled();
        });

        it('should execute after handlers when the timeout processor throws', async () => {
            const timeoutError = new Error('timeout');
            const after = jest.fn().mockResolvedValue('after');

            container.resolve
                .mockReturnValueOnce({
                    execute: () => new Promise(() => undefined)
                })
                .mockReturnValueOnce({
                    after
                });

            core.timeoutProcessor = {
                time: 1000,
                process: jest.fn().mockRejectedValue(timeoutError)
            };

            const promise = ExecutionInvoker.invoke(
                context,
                core,
                createPlan({
                    after: [
                        {
                            target: class After {},
                            method: 'after'
                        }
                    ]
                })
            );

            jest.advanceTimersByTime(1000);

            await expect(promise).resolves.toBeUndefined();

            expect(after).toHaveBeenCalled();
            expect(context.error).toBe(timeoutError);
        });
    });

    describe('filter errors', () => {
        it('should return undefined when there are no filters', async () => {
            class Main {}

            container.resolve.mockReturnValue({
                execute() {
                    throw new Error('boom');
                }
            });

            const result = await ExecutionInvoker.invoke(
                context,
                core,
                createPlan({
                    handler: {
                        target: Main,
                        method: 'execute'
                    }
                })
            );

            expect(result).toBeUndefined();
            expect(context.error).toBeInstanceOf(Error);
        });

        it('should execute only filters whose acceptedErrors match', async () => {
            class Main {}
            class WrongFilter {}
            class CorrectFilter {}

            const wrongFilter = jest.fn();
            const correctFilter = jest.fn().mockReturnValue('handled');

            container.resolve
                .mockReturnValueOnce({
                    execute() {
                        throw new TypeError('boom');
                    }
                })
                .mockReturnValueOnce({
                    filter: correctFilter
                });

            const result = await ExecutionInvoker.invoke(
                context,
                core,
                createPlan({
                    handler: {
                        target: Main,
                        method: 'execute'
                    },
                    filters: [
                        {
                            executionHandler: {
                                target: WrongFilter,
                                method: 'filter'
                            },
                            acceptedErrors: [ReferenceError]
                        },
                        {
                            executionHandler: {
                                target: CorrectFilter,
                                method: 'filter'
                            },
                            acceptedErrors: [TypeError]
                        }
                    ]
                })
            );

            expect(result).toBe('handled');
            expect(wrongFilter).not.toHaveBeenCalled();
            expect(correctFilter).toHaveBeenCalled();
        });
    });
});
