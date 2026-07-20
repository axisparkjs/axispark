import { ErrorClass } from '../errors';

export interface CatchMetadata {
    error: ErrorClass;
    propertyKey: string | symbol;
}
