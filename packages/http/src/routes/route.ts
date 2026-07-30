import { RouteHandler } from './route-handler';
import { HttpMethod } from '../types';
import { Constructor } from '@axisparkjs/di';

export interface Route {
    handler: RouteHandler;
    controller: Constructor;
    method: HttpMethod;
    path: string;
}
