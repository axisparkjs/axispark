import { SocketIOWebSocketMessage } from './socketio-websocket-message';

describe('SocketIOWebSocketMessage', () => {
    it('exposes event payload, raw data and acknowledgement', () => {
        const input = { event: 'e', data: 3, raw: 'r', ack: jest.fn() };
        const message = new SocketIOWebSocketMessage(input);
        expect(message.event).toBe('e');
        expect(message.data).toBe(3);
        expect(message.raw).toBe('r');
        expect(message.ack).toBe(input.ack);
        expect(new SocketIOWebSocketMessage({ event: 'e', data: 0 }).raw).toBeUndefined();
    });
});
