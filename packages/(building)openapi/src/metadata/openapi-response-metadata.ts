import { Constructor } from '@axisparkjs/di';

export interface OpenApiResponseMetadata {
    statusCode: number | 'default';
    type?: 'boolean' | 'string' | 'number' | 'integer' | 'null' | Constructor;
    isArray?: boolean;
    description?: string;
    nullable?: boolean;
}
