import { MetadataFromMethod } from '@axisparkjs/common';
import { HttpMethod } from '../types/http-method';

export interface RouteMetadata extends MetadataFromMethod {
    method: HttpMethod;
    path: string;
    version?: string | string[];
}
