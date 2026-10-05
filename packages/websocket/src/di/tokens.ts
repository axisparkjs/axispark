import { InjectionToken } from '@axisparkjs/di';

/**
 * An injection token for the WebSockets options.
 */
export const WEBSOCKET_OPTIONS = new InjectionToken('WEBSOCKETS_OPTIONS');
/**
 * An injection token for the WebSockets adapter.
 */
export const WEBSOCKET_ADAPTER = new InjectionToken('WEBSOCKETS_ADAPTER');
/**
 * An injection token for the WebSockets logger.
 */
export const WEBSOCKET_LOGGER = new InjectionToken('WEBSOCKETS_LOGGER');
