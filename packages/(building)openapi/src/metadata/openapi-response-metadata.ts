import { ClassType } from '@axisparkjs/di';

export interface OpenApiResponseMetadata {
    statusCode: number | 'default';
    type?: 'boolean' | 'string' | 'number' | 'integer' | 'null' | ClassType;
    isArray?: boolean;
    description?: string;
    nullable?: boolean;
}
