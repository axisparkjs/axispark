/**
 * A base class for WebSocket errors.
 */
export class WebSocketError extends Error {
    public constructor(
        public readonly response: string,
        public readonly status = 1,
        public readonly options?: { cause?: unknown; description?: string }
    ) {
        super(response);
        this.name = this.constructor.name;
    }
}
