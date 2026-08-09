import { ExecutionTimeoutProcessor, ExecutionHandler, ExecutionContext } from '@axisparkjs/engine';
import { HttpTimeoutProcessor } from './http-timeout-processor';
import { RequestTimeoutError } from '../errors';

describe('HttpTimeoutProcessor', () => {
    let context: ExecutionContext;
    let handler: ExecutionHandler;

    beforeEach(() => {
        context = {} as ExecutionContext;

        handler = {
            target: class Test {},
            method: 'execute'
        } as ExecutionHandler;
    });

    describe('process', () => {
        it('should throw RequestTimeoutError with the default message', async () => {
            const processor = new HttpTimeoutProcessor(context, handler, 5000);

            await expect(processor.process()).rejects.toThrow(new RequestTimeoutError('Request timed out after 5000ms'));
        });

        it('should throw RequestTimeoutError with the provided string message', async () => {
            const processor = new HttpTimeoutProcessor(context, handler, 3000, 'Custom timeout message');

            await expect(processor.process()).rejects.toThrow(new RequestTimeoutError('Custom timeout message'));
        });

        it('should use the message function with the timeout', async () => {
            const message = jest.fn((time: number) => `Request exceeded ${time}ms`);

            const processor = new HttpTimeoutProcessor(context, handler, 2500, message);

            await expect(processor.process()).rejects.toThrow(new RequestTimeoutError('Request exceeded 2500ms'));

            expect(message).toHaveBeenCalledTimes(1);
            expect(message).toHaveBeenCalledWith(2500);
        });

        it('should use the default message when message is an empty string', async () => {
            const processor = new HttpTimeoutProcessor(context, handler, 1000, '');

            await expect(processor.process()).rejects.toThrow(new RequestTimeoutError('Request timed out after 1000ms'));
        });

        it('should use the inherited time value', async () => {
            const processor = new HttpTimeoutProcessor(context, handler, 7500);

            expect(processor.time).toBe(7500);

            await expect(processor.process()).rejects.toThrow(new RequestTimeoutError('Request timed out after 7500ms'));
        });

        it('should use the default timeout when baseTime is not provided', async () => {
            const processor = new HttpTimeoutProcessor(context, handler);

            expect(processor.time).toBe(5000);

            await expect(processor.process()).rejects.toThrow(new RequestTimeoutError('Request timed out after 5000ms'));
        });
    });

    describe('inheritance', () => {
        it('should extend ExecutionTimeoutProcessor', () => {
            const processor = new HttpTimeoutProcessor(context, handler);

            expect(processor).toBeInstanceOf(ExecutionTimeoutProcessor);
        });
    });
});
