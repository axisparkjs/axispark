import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { WebSocketEventMetadata } from '../metadata';

/**
 * A decorator for defining a WebSocket event.
 * @param event The name of the WebSocket event.
 * @returns A method decorator.
 */
export function WebSocketEvent(event: string): MethodDecorator {
    return (target, propertyKey) => {
        const routes = Metadata.get<WebSocketEventMetadata[]>(MetadataKeys.WEBSOCKET_EVENT, target) ?? [];

        const metadata: WebSocketEventMetadata = {
            target: Metadata.normalizeTarget(target),
            propertyKey,
            event
        };
        routes.push(metadata);

        Metadata.define(MetadataKeys.WEBSOCKET_EVENT, routes, target);
        Metadata.define(MetadataKeys.WEBSOCKET_EVENT, metadata, target, propertyKey);
    };
}
