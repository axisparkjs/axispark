import { Constructor } from '@axisparkjs/di';
import { ExecutionStepType } from '../execution-step-type';
import { ExecutionStepScope } from '../execution-step-scope';
import { ErrorClass } from '../types';

export interface ExecutionStepMethodMetadata {
    target: Constructor;
    propertyKey: string | symbol;
    type: ExecutionStepType;
}
export interface HandleMetadata extends ExecutionStepMethodMetadata {
    type: ExecutionStepType.Middleware;
}
export interface CheckMetadata extends ExecutionStepMethodMetadata {
    type: ExecutionStepType.Guard;
}
export interface BeforeMetadata extends ExecutionStepMethodMetadata {
    type: ExecutionStepType.Interceptor;
    scope: ExecutionStepScope.Before;
}
export interface AfterMetadata extends ExecutionStepMethodMetadata {
    type: ExecutionStepType.Interceptor;
    scope: ExecutionStepScope.After;
}
export interface CatchMetadata extends ExecutionStepMethodMetadata {
    type: ExecutionStepType.Filter;
    acceptedErrors: ErrorClass[];
}
