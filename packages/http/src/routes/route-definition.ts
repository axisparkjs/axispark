import { RouteHandler } from './route-handler';
import { HttpMethod } from '../types';
import { ClassType } from '@axisparkjs/common';

export class RouteDefinition {
    constructor(
        public readonly target: ClassType,
        public readonly propertyKey: string | symbol,
        public readonly httpMethod: HttpMethod,
        public readonly path: string,
        public readonly handler: RouteHandler,
    ) {}
}
