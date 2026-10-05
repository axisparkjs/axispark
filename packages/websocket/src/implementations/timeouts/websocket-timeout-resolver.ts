import { TimeoutResolver, TimeoutDefinition } from '@axisparkjs/engine';
import { WebSocketError } from '../errors';
import { Injectable } from '@axisparkjs/di';

/**
 * A resolver for handling WebSocket request timeouts. It throws a RequestTimeoutError with a custom message when a timeout occurs.
 */
@Injectable()
export class WebSocketTimeoutResolver implements TimeoutResolver {
    public async resolve(timeout: TimeoutDefinition): Promise<void> {
        throw new WebSocketError('Request timed out after ' + timeout.time + 'ms');
    }
}
