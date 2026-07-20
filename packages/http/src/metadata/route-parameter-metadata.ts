import { RouteParameter } from '../types/route-parameter';

export interface RouteParameterMetadata {
    index: number;
    parameter: RouteParameter;
    name?: string;
}
