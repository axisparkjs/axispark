import { WebSocketError } from '../errors';
import { OkWebSocketResult, ErrorWebSocketResult } from './websocket-result';

/**
 * A static class for creating WebSocket results.
 */
export class WebSocketResultsStatic {
    public Ok(value: unknown) {
        return new OkWebSocketResult(value);
    }
    public Error(error: WebSocketError) {
        return new ErrorWebSocketResult(error);
    }
}

/**
 * A singleton instance of WebSocketResultsStatic for creating WebSocket results.
 */
export const WebSocketResults = new WebSocketResultsStatic();
