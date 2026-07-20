import { CatchEntry } from '../errors';
import { RouteEntry } from '../routing/route-entry';

export interface HttpAdapter {
    registerRoutes(routes: readonly RouteEntry[]): void | Promise<void>;
    registerCatchs(catchs: readonly CatchEntry[]): void | Promise<void>;
    start(): void | Promise<void>;
    stop(): void | Promise<void>;
}
export type HttpAdapterClass<T extends HttpAdapter = HttpAdapter> = new (...args: any[]) => T;
