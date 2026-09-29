import { PluginOptions } from '@axisparkjs/core';
import { WebSocketAdapterClass } from '../adapter/websocket-adapter';

export interface WebSocketPluginOptions extends PluginOptions {
    /**
     * The WebSocket adapter to use. Express or Fastify are supported.
     */
    adapter: WebSocketAdapterClass;
    /**
     * The number of ms before disconnecting a client that has not successfully joined a namespace.
     */
    connectTimeout?: number;
    /**
     * It is the name of the path that is captured on the server side.
     */
    path?: string;
    /**
     * Whether to serve the client files. Default is true. If set to false, the client files will not be served.
     */
    serveClient?: boolean;
    /**
     * Whether to use the built-in HTTP server for WebSockets. Default is false. If set to true, the WebSocket server will be created using the built-in HTTP server.
     */
    useHttpPluginServer: boolean;
    /**
     * The port on which the WebSocket server will listen. Default is 3000.
     */
    port?: number;
}
