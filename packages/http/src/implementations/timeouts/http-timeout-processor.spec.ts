import { TimeoutDefinition } from '@axisparkjs/engine';
import { HttpTimeoutProcessor } from './http-timeout-processor';
import { RequestTimeoutError } from '../errors';
import { HttpPluginOptions } from '../../plugin';

describe('HttpTimeoutProcessor', () => {
    const createTimeout = (time: number): TimeoutDefinition => ({ time }) as TimeoutDefinition;

    it('should throw RequestTimeoutError with the default message', async () => {
        const options = {} as HttpPluginOptions;
        const processor = new HttpTimeoutProcessor(options);

        await expect(processor.resolve(createTimeout(5000))).rejects.toThrow(new RequestTimeoutError('Request timed out after 5000ms'));
    });

    it('should throw RequestTimeoutError with the provided string message', async () => {
        const options = {
            timeoutOptions: {
                message: 'Custom timeout message'
            }
        } as HttpPluginOptions;

        const processor = new HttpTimeoutProcessor(options);

        await expect(processor.resolve(createTimeout(3000))).rejects.toThrow(new RequestTimeoutError('Custom timeout message'));
    });

    it('should use the message function with the timeout', async () => {
        const message = jest.fn((time: number) => `Request exceeded ${time}ms`);

        const options = {
            timeoutOptions: {
                message
            }
        } as any as HttpPluginOptions;

        const processor = new HttpTimeoutProcessor(options);

        await expect(processor.resolve(createTimeout(2500))).rejects.toThrow(new RequestTimeoutError('Request exceeded 2500ms'));

        expect(message).toHaveBeenCalledTimes(1);
        expect(message).toHaveBeenCalledWith(2500);
    });

    it('should use the default message when message is an empty string', async () => {
        const options = {
            timeoutOptions: {
                message: ''
            }
        } as HttpPluginOptions;

        const processor = new HttpTimeoutProcessor(options);

        await expect(processor.resolve(createTimeout(1000))).rejects.toThrow(new RequestTimeoutError('Request timed out after 1000ms'));
    });

    it('should use the default message when timeout options are not provided', async () => {
        const options = {} as HttpPluginOptions;
        const processor = new HttpTimeoutProcessor(options);

        await expect(processor.resolve(createTimeout(7500))).rejects.toThrow(new RequestTimeoutError('Request timed out after 7500ms'));
    });

    it('should use the default message when message is undefined', async () => {
        const options = {
            timeoutOptions: {
                message: undefined
            }
        } as HttpPluginOptions;

        const processor = new HttpTimeoutProcessor(options);

        await expect(processor.resolve(createTimeout(2000))).rejects.toThrow(new RequestTimeoutError('Request timed out after 2000ms'));
    });
});
