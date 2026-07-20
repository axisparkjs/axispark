import { RouteEntry } from './route-entry';

export class RouteRegistry {
    private readonly routes: RouteEntry[] = [];

    registerRoutes(routes: RouteEntry[]): void {
        this.routes.push(...routes);
    }

    registerRoute(route: RouteEntry): void {
        this.routes.push(route);
    }

    getRoutes(): readonly RouteEntry[] {
        return this.routes;
    }
}
