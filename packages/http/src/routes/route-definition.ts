import { RouteHandler } from './route-handler';
import { HttpMethod } from '../types';
import { ClassType } from '@axisparkjs/common';

/**
 * A class representing the definition of an HTTP route.
 */
export class RouteDefinition {
    constructor(
        public readonly target: ClassType,
        public readonly propertyKey: string | symbol,
        public readonly httpMethod: HttpMethod,
        public readonly path: string,
        public readonly versions: string[] | undefined,
        public readonly handler: RouteHandler
    ) {}
}
