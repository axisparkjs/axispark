import { WebSocketConnection } from '@axisparkjs/websocket';
import { Socket } from 'socket.io';

export class SocketIOWebSocketConnection implements WebSocketConnection {
    constructor(private readonly socket: Socket) {}

    get id(): string {
        return this.socket.id;
    }

    get namespace(): string | undefined {
        return this.socket.nsp.name;
    }

    get rooms(): readonly string[] {
        return Array.from(this.socket.rooms);
    }

    emit<TData = unknown>(event: string, data?: TData): void {
        this.socket.emit(event, data);
    }

    join(room: string): void {
        this.socket.join(room);
    }

    leave(room: string): void {
        this.socket.leave(room);
    }

    broadcast<TData = unknown>(room: string, event: string, data?: TData): void {
        this.socket.to(room).emit(event, data);
    }

    close(_code?: number, _reason?: string): void {
        this.socket.disconnect(true);
    }

    get connected(): boolean {
        return this.socket.connected;
    }
}
