import { HttpServer } from '@axisparkjs/common';
import { WebSocketEventDefinition } from '../events';

/**
 * An interface representing a WebSocket adapter.
 * It defines the contract for handling WebSocket-related operations.
 */
export interface WebSocketAdapter {
    /**
     * Registers the provided events with the adapter.
     * @param events An array of event definitions to be registered.
     * @returns A promise that resolves when the events have been registered, or void if the operation is synchronous.
     */
    registerEvents(events: readonly WebSocketEventDefinition[]): void | Promise<void>;
    /**
     * Retrieves the registered events from the adapter.
     * @returns An array of event definitions that have been registered with the adapter.
     */
    getRegisteredEvents(): readonly WebSocketEventDefinition[];
    /**
     * Initializes the WebSocket adapter.
     * @param server The HTTP server to use for the WebSocket connection. If not provided, the adapter will create its own.
     * @returns A promise that resolves when the adapter has been initialized, or void if the operation is synchronous.
     */
    initialize?(server?: HttpServer): void | Promise<void>;
    /**
     * Starts the WebSocket adapter.
     * @returns A promise that resolves when the adapter has been started, or void if the operation is synchronous.
     */
    start(): void | Promise<void>;
    /**
     * Stops the WebSocket adapter.
     * @returns A promise that resolves when the adapter has been stopped, or void if the operation is synchronous.
     */
    stop(): void | Promise<void>;
}
/**
 * A type representing a class that implements the `WebSocketAdapter` interface.
 */
export type WebSocketAdapterClass<T extends WebSocketAdapter = WebSocketAdapter> = new (...args: any[]) => T;
