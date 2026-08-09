import { Route } from '../routes/route';

export interface HttpAdapter {
    registerRoutes(routes: readonly Route[]): void | Promise<void>;
    getRegisteredRoutes(): readonly Route[];
    initialize?(): void | Promise<void>;
    start(): void | Promise<void>;
    stop(): void | Promise<void>;
}
export type HttpAdapterClass<T extends HttpAdapter = HttpAdapter> = new (...args: any[]) => T;
