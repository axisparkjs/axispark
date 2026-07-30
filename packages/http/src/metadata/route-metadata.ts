import { HttpMethod } from '../types/http-method';

export interface RouteMetadata {
    method: HttpMethod;
    path: string;
    propertyKey: string | symbol;
}
