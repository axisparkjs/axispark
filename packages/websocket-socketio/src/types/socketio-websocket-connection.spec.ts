import { SocketIOWebSocketConnection } from './socketio-websocket-connection';

describe('SocketIOWebSocketConnection', () => {
    it('forwards connection operations to socket', () => {
        const socket: any = {
            id: 'id',
            nsp: { name: '/room' },
            rooms: new Set(['a', 'b']),
            connected: true,
            emit: jest.fn(),
            join: jest.fn(),
            leave: jest.fn(),
            to: jest.fn().mockReturnValue({ emit: jest.fn() }),
            disconnect: jest.fn()
        };
        const connection = new SocketIOWebSocketConnection(socket);
        expect(connection.id).toBe('id');
        expect(connection.namespace).toBe('/room');
        expect(connection.rooms).toEqual(['a', 'b']);
        expect(connection.connected).toBe(true);
        connection.emit('x', 1);
        connection.join('a');
        connection.leave('b');
        connection.broadcast('r', 'y', 2);
        connection.close(3, 'bye');
        expect(socket.emit).toHaveBeenCalledWith('x', 1);
        expect(socket.join).toHaveBeenCalledWith('a');
        expect(socket.leave).toHaveBeenCalledWith('b');
        expect(socket.to).toHaveBeenCalledWith('r');
        expect(socket.disconnect).toHaveBeenCalledWith(true);
    });
});
