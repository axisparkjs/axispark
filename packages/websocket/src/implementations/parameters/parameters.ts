import { ParameterResolver, Parameter } from '@axisparkjs/engine';
import { WebSocketParameter } from '../../types/websocket-parameter';
import { WebSocketConnection } from '../../types/websocket-connection';
import { WebSocketMessage } from '../../types/websocket-message';
import { WebSocketContext } from '../../types/websocket-context';
import { Injectable } from '@axisparkjs/di';

/**
 * A parameter for injecting the WebSocket connection.
 */
export const WsConnection = () => Parameter(WebSocketParameter.Connection);
/**
 * A parameter for injecting the WebSocket message.
 */
export const WsMessage = () => Parameter(WebSocketParameter.Message);
/**
 * A parameter for injecting the WebSocket data.
 */
export const WsData = () => Parameter(WebSocketParameter.Data);
/**
 * A parameter for injecting the WebSocket acknowledgment.
 */
export const WsAck = () => Parameter(WebSocketParameter.Ack);

@Injectable()
export class WsConnectionResolver implements ParameterResolver<WebSocketConnection> {
    resolve(webSocketContext: WebSocketContext) {
        return webSocketContext.connection;
    }
}
@Injectable()
export class WsMessageResolver implements ParameterResolver<WebSocketMessage | undefined> {
    resolve(webSocketContext: WebSocketContext) {
        return webSocketContext.message;
    }
}
@Injectable()
export class WsDataResolver implements ParameterResolver<any> {
    resolve(webSocketContext: WebSocketContext) {
        return webSocketContext.message?.data;
    }
}
@Injectable()
export class WsAckResolver implements ParameterResolver<((response?: unknown) => void) | undefined> {
    resolve(webSocketContext: WebSocketContext) {
        return webSocketContext.message?.ack;
    }
}
