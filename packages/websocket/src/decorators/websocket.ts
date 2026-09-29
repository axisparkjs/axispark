import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';
import { WebSocketMetadata } from '../metadata/websocket-metadata';

/**
 * A decorator for defining a WebSocket with a specific namespace.
 * @param namespace The namespace for the WebSocket.
 * @returns A class decorator.
 */
export function WebSocket(namespace: string | Omit<WebSocketMetadata, 'target'> = ''): ClassDecorator {
    return (target) => {
        const metadata: WebSocketMetadata = {
            target: Metadata.normalizeTarget(target),
            namespace: typeof namespace === 'string' ? namespace : namespace.namespace
        };
        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.WEBSOCKET, metadata, target);
    };
}
