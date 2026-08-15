import { Executable } from '@axisparkjs/common';
import { HttpContext } from '../types';
import { Injectable } from '@axisparkjs/di';
import { ExecutionEngine } from '@axisparkjs/engine';
import { VersionGenerator, VersionProcessor, VersionDefinition } from '../version';
import { RouteDefinition } from '../routes';

@Injectable()
export class HttpEngine implements Executable {
    constructor(
        private readonly executionEngine: ExecutionEngine,
        private readonly versionGenerator: VersionGenerator,
        private readonly versionProcessor: VersionProcessor
    ) {}

    public async execute(context: HttpContext): Promise<void> {
        const versionDefinition = this.versionGenerator.generate(context);
        this.versionProcessor.process(versionDefinition, context);
        context.version = versionDefinition;

        await this.executionEngine.execute(context);
    }

    public async versionMapping(routes: RouteDefinition[], context: Pick<HttpContext, 'request' | 'response' | 'session'>): Promise<void> {
        const tempDefinition = new VersionDefinition([]);
        this.versionProcessor.process(tempDefinition, { ...context });

        let finalRoute = routes.find((route) => {
            if (!route.versions || route.versions.length === 0) return false;
            return route.versions.includes(tempDefinition.version || '');
        });

        if (!finalRoute) finalRoute = routes.find((route) => route.versions?.includes('default'));
        if (!finalRoute) finalRoute = routes[0];

        await finalRoute.handler(context);
    }
}
