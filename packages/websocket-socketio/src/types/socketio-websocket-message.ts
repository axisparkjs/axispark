import { WebSocketMessage } from '@axisparkjs/websocket';

export class SocketIOWebSocketMessage implements WebSocketMessage {
    constructor(
        private readonly socketIOEvent: {
            event: string;
            data: any;
            raw?: unknown;
            ack?: (response?: unknown) => void;
        }
    ) {}

    get event(): string {
        return this.socketIOEvent.event;
    }

    get data(): any {
        return this.socketIOEvent.data;
    }

    get raw(): unknown {
        return this.socketIOEvent.raw;
    }

    get ack() {
        return this.socketIOEvent.ack;
    }
}
