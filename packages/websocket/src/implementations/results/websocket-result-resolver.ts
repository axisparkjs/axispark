import { ResultDefinition, ResultResolver, HandledResult } from '@axisparkjs/engine';
import { OkWebSocketResult } from './websocket-result';
import { Injectable } from '@axisparkjs/di';

/**
 * A resolver for creating WebSocket results from unknown values.
 */
@Injectable()
export class WebSocketResultResolver implements ResultResolver {
    /**
     * Resolves an unknown value into an WebSocket result.
     * @param result The unknown value to resolve.
     * @returns The resolved WebSocket result.
     */
    public resolve(result: unknown): ResultDefinition {
        if (result !== undefined && result !== null) {
            return new OkWebSocketResult(result);
        }
        return new HandledResult();
    }
}
