import { SocketIOWebSocketAdapter } from './socketio-websocket-adapter';
import { SocketIOWebSocketConnection } from '../types/socketio-websocket-connection';

jest.mock('socket.io', () => ({
    Server: jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        listen: jest.fn(),
        close: jest.fn().mockResolvedValue(undefined)
    }))
}));

describe('SocketIOWebSocketAdapter', () => {
    it('initializes, registers events, handles connection and messages, and closes', async () => {
        const adapter = new SocketIOWebSocketAdapter({ useHttpPluginServer: true, path: '/ws' } as any);
        adapter.initialize?.({} as any);
        const connectionHandler = jest.fn();
        const messageHandler = jest.fn();
        adapter.registerEvents([
            { event: 'connection', handler: connectionHandler },
            { event: 'chat', handler: messageHandler }
        ] as any);
        expect(adapter.getRegisteredEvents()).toHaveLength(2);
        const listeners: any = {};
        const socket: any = {
            on: jest.fn((name, cb) => {
                listeners[name] = cb;
            }),
            id: 'x',
            nsp: { name: '/' },
            rooms: new Set(),
            connected: true
        };
        const io = (adapter as any).io;
        const connect = io.on.mock.calls.find((call: any[]) => call[0] === 'connection')[1];
        await connect(socket);
        expect(connectionHandler).toHaveBeenCalledWith(expect.objectContaining({ connection: expect.any(SocketIOWebSocketConnection), message: undefined }));
        const ack = jest.fn();
        await listeners.chat(1, ack);
        expect(messageHandler).toHaveBeenCalledWith(expect.objectContaining({ message: expect.objectContaining({ event: 'chat', data: 1, ack }) }));
        await adapter.start();
        await adapter.stop();
        expect(io.close).toHaveBeenCalled();
    });
    it('registers without a connection handler and listens on default port', async () => {
        const adapter = new SocketIOWebSocketAdapter({ useHttpPluginServer: false } as any);
        adapter.initialize?.();
        adapter.registerEvents([]);
        const io = (adapter as any).io;
        const socket: any = { on: jest.fn() };
        await io.on.mock.calls.find((call: any[]) => call[0] === 'connection')[1](socket);
        await adapter.start();
        expect(io.listen).toHaveBeenCalledWith(3000);
    });
});
