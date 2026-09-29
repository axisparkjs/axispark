import { WebSocketContext } from '../types/websocket-context';

/**
 * A type representing a route handler function.
 * @param context The WebSocket context containing information.
 * @returns A promise that resolves when the route handling is complete.
 */
export type WebSocketEventHandler = (context: Pick<WebSocketContext, 'message' | 'connection'>) => void | Promise<void>;
