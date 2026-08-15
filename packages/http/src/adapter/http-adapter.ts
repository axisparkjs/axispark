import { RouteDefinition } from '../routes/route-definition';

export interface HttpAdapter {
    registerRoutes(routes: readonly RouteDefinition[]): void | Promise<void>;
    getRegisteredRoutes(): readonly RouteDefinition[];
    initialize?(): void | Promise<void>;
    start(): void | Promise<void>;
    stop(): void | Promise<void>;
}
export type HttpAdapterClass<T extends HttpAdapter = HttpAdapter> = new (...args: any[]) => T;
