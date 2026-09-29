import { ExecutionContext } from '@axisparkjs/engine';
import { WebSocketMessage } from './websocket-message';
import { WebSocketConnection } from './websocket-connection';

/**
 * Represents the context of a WebSocket connection. Extends the ExecutionContext from the engine module.
 */
export interface WebSocketContext extends ExecutionContext {
    message?: WebSocketMessage;
    connection: WebSocketConnection;
}
