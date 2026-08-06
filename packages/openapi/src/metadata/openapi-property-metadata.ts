import { Constructor } from "@axisparkjs/di";

export interface OpenApiPropertyMetadata {
    name: string;
    type:
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "null"
    | Constructor;
    isArray?: boolean;
    description?: string;
    required?: boolean;
    nullable?: boolean;
    enum?: unknown[];
    format?: string;
    example?: unknown;
    default?: unknown;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minimum?: number;
    maximum?: number;
}