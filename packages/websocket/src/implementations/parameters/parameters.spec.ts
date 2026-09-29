import { Parameter } from '@axisparkjs/engine';
import { WsConnection, WsMessage, WsData, WsAck } from './parameters';
import { WsConnectionResolver, WsMessageResolver, WsDataResolver, WsAckResolver } from './parameters';
import { WebSocketParameter } from '../../types/websocket-parameter';

jest.mock('@axisparkjs/engine', () => {
    const originalModule = jest.requireActual('@axisparkjs/engine');

    return {
        ...originalModule,
        Parameter: jest.fn()
    };
});

describe('WebSocket parameter decorators', () => {
    beforeEach(() => {
        (Parameter as jest.Mock).mockClear();
    });

    it('WsConnection should call Parameter with Connection', () => {
        WsConnection();
        expect(Parameter).toHaveBeenCalledWith(WebSocketParameter.Connection);
    });

    it('WsMessage should call Parameter with Message', () => {
        WsMessage();
        expect(Parameter).toHaveBeenCalledWith(WebSocketParameter.Message);
    });

    it('WsData should call Parameter with Data', () => {
        WsData();
        expect(Parameter).toHaveBeenCalledWith(WebSocketParameter.Data);
    });

    it('WsAck should call Parameter with Ack', () => {
        WsAck();
        expect(Parameter).toHaveBeenCalledWith(WebSocketParameter.Ack);
    });
});

describe('ParameterResolvers', () => {
    const connection = { id: 'socket-1' };
    const message = { event: 'chat', data: { text: 'hello' }, ack: jest.fn() };
    const wsContext: any = {
        connection,
        message
    };

    const wsContextNoMessage: any = {
        connection,
        message: undefined
    };

    describe('WsConnectionResolver', () => {
        it('should return the connection', () => {
            const resolver = new WsConnectionResolver();
            expect(resolver.resolve(wsContext)).toBe(connection);
        });
    });

    describe('WsMessageResolver', () => {
        it('should return the message', () => {
            const resolver = new WsMessageResolver();
            expect(resolver.resolve(wsContext)).toBe(message);
        });

        it('should return undefined when there is no message', () => {
            const resolver = new WsMessageResolver();
            expect(resolver.resolve(wsContextNoMessage)).toBeUndefined();
        });
    });

    describe('WsDataResolver', () => {
        it('should return the message data', () => {
            const resolver = new WsDataResolver();
            expect(resolver.resolve(wsContext)).toEqual({ text: 'hello' });
        });

        it('should return undefined when there is no message', () => {
            const resolver = new WsDataResolver();
            expect(resolver.resolve(wsContextNoMessage)).toBeUndefined();
        });
    });

    describe('WsAckResolver', () => {
        it('should return the ack callback', () => {
            const resolver = new WsAckResolver();
            expect(resolver.resolve(wsContext)).toBe(message.ack);
        });

        it('should return undefined when there is no message', () => {
            const resolver = new WsAckResolver();
            expect(resolver.resolve(wsContextNoMessage)).toBeUndefined();
        });
    });
});
