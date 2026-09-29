import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { WebSocket } from './websocket';

describe('WebSocket', () => {
    it('stores a string namespace', () => {
        @WebSocket('/chat')
        class Chat {}
        expect(Metadata.get(MetadataKeys.WEBSOCKET, Chat)).toMatchObject({ namespace: '/chat' });
    });
    it('stores an object namespace and defaults to an empty namespace', () => {
        @WebSocket({ namespace: '/news' })
        class News {}
        @WebSocket()
        class DefaultNamespace {}
        expect(Metadata.get(MetadataKeys.WEBSOCKET, News)).toMatchObject({ namespace: '/news' });
        expect(Metadata.get(MetadataKeys.WEBSOCKET, DefaultNamespace)).toMatchObject({ namespace: '' });
    });
});
