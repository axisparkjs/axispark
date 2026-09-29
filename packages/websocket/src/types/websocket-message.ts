/**
 * Represents a single incoming WebSocket event/message being processed.
 */
export interface WebSocketMessage<T = unknown> {
    /** Name of the event received (e.g. 'chat:send', 'user:typing'). */
    event: string;
    /** Payload sent with the event, already parsed/deserialized. */
    data: T;
    /** Raw, unparsed payload as received from the underlying adapter, if available. */
    raw?: unknown;
    /** Optional acknowledgement callback, if the underlying adapter supports it (e.g. socket.io). */
    ack?: (response?: unknown) => void;
}
