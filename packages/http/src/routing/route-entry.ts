import { Constructor } from '@axisparkjs/di';
import { RouteHandler } from './route-handler';
import { RouteMetadata } from '../metadata';
import { HttpStatus } from '../errors';

export interface RouteEntry extends RouteMetadata {
    controller: Constructor;
    handler: RouteHandler;
    statusCode: HttpStatus;
}
