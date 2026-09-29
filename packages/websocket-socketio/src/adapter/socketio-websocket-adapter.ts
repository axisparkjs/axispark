import { Inject, Injectable } from '@axisparkjs/di';
import { HttpServer } from '@axisparkjs/common';
import { WebSocketAdapter, WebSocketEventDefinition, WEBSOCKET_OPTIONS } from '@axisparkjs/websocket';
import { SocketIOWebSocketConnection } from '../types/socketio-websocket-connection';
import { SocketIOWebSocketMessage } from '../types/socketio-websocket-message';
import { SocketIOWebSocketPluginOptions } from '../plugin/socketio-websocket-plugin-options';
import { Server, Socket } from 'socket.io';

/**
 * A Socket.IO adapter for integrating Socket.IO with the HTTP Plugin.
 */
@Injectable()
export class SocketIOWebSocketAdapter implements WebSocketAdapter {
    private io: Server;
    private readonly registeredEvents: WebSocketEventDefinition[] = [];

    constructor(
        @Inject(WEBSOCKET_OPTIONS)
        private readonly options: SocketIOWebSocketPluginOptions
    ) {}

    initialize?(server?: HttpServer): void | Promise<void> {
        this.io = new Server(this.options.useHttpPluginServer ? server : undefined, {
            connectTimeout: this.options.connectTimeout,
            path: this.options.path,
            serveClient: this.options.serveClient
        });
    }

    getRegisteredEvents(): readonly WebSocketEventDefinition[] {
        return this.registeredEvents;
    }

    registerEvents(events: readonly WebSocketEventDefinition[]): void {
        this.registeredEvents.push(...events);

        const eventByNamespace = new Map<string, WebSocketEventDefinition[]>();
        for (const event of events) {
            if (!eventByNamespace.has(event.namespace)) {
                eventByNamespace.set(event.namespace, []);
                console.log(`Registering namespace: ${event.namespace}`);
            }
            eventByNamespace.get(event.namespace)?.push(event);
        }

        for (const [namespace, events] of eventByNamespace.entries()) {
            const nsp = this.io.of(namespace);
            let connectionEvent: ((socket: Socket) => Promise<void>) | undefined;
            const connectionEventDefinition = events.find((event) => event.event === 'connection');
            if (connectionEventDefinition) {
                connectionEvent = async (socket: Socket) => {
                    const context = this.createContext(socket);
                    await connectionEventDefinition.handler(context);
                };
                events.splice(events.indexOf(connectionEventDefinition), 1);
            }

            console.log(`Registering events for namespace: ${namespace}, events: ${events.map((e) => e.event).join(', ')}`);

            nsp.on('connection', async (socket: Socket) => {
                await connectionEvent?.(socket);

                for (const event of events) {
                    socket.on(event.event, async (data: unknown, ack?: (response?: unknown) => void) => {
                        const context = this.createContext(socket, { event: event.event, data, ack });
                        await event.handler(context);
                    });
                }
            });
        }
    }

    private createContext(
        socket: Socket,
        event?: {
            event: string;
            data: any;
            raw?: unknown;
            ack?: (response?: unknown) => void;
        }
    ) {
        const con = new SocketIOWebSocketConnection(socket);
        let mes;
        if (event) mes = new SocketIOWebSocketMessage(event);
        return { connection: con, message: mes };
    }

    async start(): Promise<void> {
        if (!this.options.useHttpPluginServer) {
            this.io.listen(this.options.port || 3000);
        }
    }

    async stop(): Promise<void> {
        await this.io.close();
    }
}
