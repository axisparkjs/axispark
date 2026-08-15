import { ExecutionContext, ExecutionTransport } from '../execution';
import { ResultDefinition } from './result-definition';
import { ResultProcessor } from './result-processor';
import { ResultResolver } from './result-resolver';

class TestResult<T = unknown> extends ResultDefinition<T> {
    public readonly processMock = jest.fn();

    public async process(context: ExecutionContext): Promise<void> {
        this.processMock(context);
    }
}

describe('ResultProcessor', () => {
    let processor: ResultProcessor;

    beforeEach(() => {
        jest.clearAllMocks();

        processor = new ResultProcessor();
    });

    describe('registerResult', () => {
        it('should register a resolver for a transport', async () => {
            const resolver: ResultResolver = {
                resolve: jest.fn()
            };

            const result = new TestResult('resolved', 200);

            (resolver.resolve as jest.Mock).mockResolvedValue(result);

            ResultProcessor.registerResult(ExecutionTransport.Http, resolver);

            const context = {
                transport: ExecutionTransport.Http
            } as ExecutionContext;

            await processor.process('value', context);

            expect(resolver.resolve).toHaveBeenCalledTimes(1);
            expect(resolver.resolve).toHaveBeenCalledWith('value', context);
        });

        it('should replace the resolver registered for the same transport', async () => {
            const firstResolver: ResultResolver = {
                resolve: jest.fn()
            };

            const secondResolver: ResultResolver = {
                resolve: jest.fn()
            };

            (firstResolver.resolve as jest.Mock).mockResolvedValue(new TestResult('first', 200));

            (secondResolver.resolve as jest.Mock).mockResolvedValue(new TestResult('second', 200));

            ResultProcessor.registerResult(ExecutionTransport.Http, firstResolver);

            ResultProcessor.registerResult(ExecutionTransport.Http, secondResolver);

            const context = {
                transport: ExecutionTransport.Http
            } as ExecutionContext;

            await processor.process('value', context);

            expect(firstResolver.resolve).not.toHaveBeenCalled();
            expect(secondResolver.resolve).toHaveBeenCalledWith('value', context);
        });
    });

    describe('process', () => {
        it('should process a Result directly', async () => {
            const result = new TestResult('value', 200);

            const context = {
                transport: ExecutionTransport.Http
            } as ExecutionContext;

            await processor.process(result, context);

            expect(result.processMock).toHaveBeenCalledTimes(1);
            expect(result.processMock).toHaveBeenCalledWith(context);
        });

        it('should not use the resolver when the result is already a Result', async () => {
            const resolver: ResultResolver = {
                resolve: jest.fn()
            };

            ResultProcessor.registerResult(ExecutionTransport.Http, resolver);

            const result = new TestResult('value', 200);

            const context = {
                transport: ExecutionTransport.Http
            } as ExecutionContext;

            await processor.process(result, context);

            expect(resolver.resolve).not.toHaveBeenCalled();
            expect(result.processMock).toHaveBeenCalledWith(context);
        });

        it('should resolve a non-Result value', async () => {
            const result = new TestResult('resolved', 201);

            const resolver: ResultResolver = {
                resolve: jest.fn().mockResolvedValue(result)
            };

            ResultProcessor.registerResult(ExecutionTransport.Http, resolver);

            const context = {
                transport: ExecutionTransport.Http
            } as ExecutionContext;

            await processor.process('value', context);

            expect(resolver.resolve).toHaveBeenCalledTimes(1);
            expect(resolver.resolve).toHaveBeenCalledWith('value', context);
        });

        it('should process the Result returned by the resolver', async () => {
            const result = new TestResult('resolved', 201);

            const resolver: ResultResolver = {
                resolve: jest.fn().mockResolvedValue(result)
            };

            ResultProcessor.registerResult(ExecutionTransport.Http, resolver);

            const context = {
                transport: ExecutionTransport.Http
            } as ExecutionContext;

            await processor.process('value', context);

            expect(result.processMock).toHaveBeenCalledTimes(1);
            expect(result.processMock).toHaveBeenCalledWith(context);
        });

        it('should return without processing when no resolver is registered', async () => {
            const context = {
                transport: 'test' as ExecutionTransport
            } as ExecutionContext;

            await expect(processor.process('value', context)).resolves.toBeUndefined();
        });

        it('should propagate an error from the resolver', async () => {
            const error = new Error('Result resolution failed');

            const resolver: ResultResolver = {
                resolve: jest.fn().mockRejectedValue(error)
            };

            ResultProcessor.registerResult(ExecutionTransport.Http, resolver);

            const context = {
                transport: ExecutionTransport.Http
            } as ExecutionContext;

            await expect(processor.process('value', context)).rejects.toBe(error);
        });

        it('should propagate an error from Result.process', async () => {
            const error = new Error('Result processing failed');

            class ErrorResult extends ResultDefinition {
                public async process(_context: ExecutionContext): Promise<void> {
                    throw error;
                }
            }

            const result = new ErrorResult('value', 500);

            const context = {
                transport: ExecutionTransport.Http
            } as ExecutionContext;

            await expect(processor.process(result, context)).rejects.toBe(error);
        });

        it('should use the resolver registered for the context transport', async () => {
            const httpResolver: ResultResolver = {
                resolve: jest.fn().mockResolvedValue(new TestResult('http', 200))
            };

            const otherResolver: ResultResolver = {
                resolve: jest.fn().mockResolvedValue(new TestResult('other', 200))
            };

            ResultProcessor.registerResult(ExecutionTransport.Http, httpResolver);

            ResultProcessor.registerResult(ExecutionTransport.Other, otherResolver);

            const context = {
                transport: ExecutionTransport.Http
            } as ExecutionContext;

            await processor.process('value', context);

            expect(httpResolver.resolve).toHaveBeenCalledWith('value', context);

            expect(otherResolver.resolve).not.toHaveBeenCalled();
        });
    });
});
