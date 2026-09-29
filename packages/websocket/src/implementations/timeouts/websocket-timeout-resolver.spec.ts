import { TimeoutDefinition } from '@axisparkjs/engine';
import { WebSocketTimeoutResolver } from './websocket-timeout-resolver';
import { WebSocketError } from '../errors';

describe('WebSocketTimeoutResolver', () => {
    const createTimeout = (time: number): TimeoutDefinition => ({ time }) as TimeoutDefinition;

    it('should throw WebSocketError with a default message indicating the timeout', async () => {
        const resolver = new WebSocketTimeoutResolver();

        await expect(resolver.resolve(createTimeout(5000))).rejects.toThrow(WebSocketError);
        await expect(resolver.resolve(createTimeout(5000))).rejects.toThrow('Request timed out after 5000ms');
    });

    it('should include the timeout duration in the error message', async () => {
        const resolver = new WebSocketTimeoutResolver();

        await expect(resolver.resolve(createTimeout(3000))).rejects.toThrow('Request timed out after 3000ms');
    });
});
