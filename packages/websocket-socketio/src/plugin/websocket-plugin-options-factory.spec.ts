import { WebSocketPluginOptionsFactory } from './websocket-plugin-options-factory';

describe('WebSocketPluginOptionsFactory', () => {
    it('creates defaults and applies overrides', () => {
        expect(WebSocketPluginOptionsFactory.create()).toMatchObject({
            connectTimeout: 5000,
            path: '/websocket',
            serveClient: true,
            useHttpPluginServer: false,
            port: 3000
        });
        expect(WebSocketPluginOptionsFactory.create({ port: 9, path: '/custom' })).toMatchObject({ port: 9, path: '/custom' });
    });
});
