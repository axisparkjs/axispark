export interface ParameterMetadata {
    index: number;
    parameter: string;
    name?: string;
    propertyKey: string | symbol;
    target: object;
}
