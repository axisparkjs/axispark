import { RouteHandler } from './route-handler';
import { HttpMethod } from '../types';
import { Constructor } from '@axisparkjs/di';

export interface Route {
    handler: RouteHandler;
    controller: Constructor;
    propertyKey: string | symbol;
    method: HttpMethod;
    path: string;
}
