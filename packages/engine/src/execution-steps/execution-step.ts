import { Constructor } from '@axisparkjs/di';
import { ExecutionStepType } from './execution-step-type';
import { ExecutionStepScope } from './execution-step-scope';
import { ExecutionTransport } from '../execution';
import { ErrorClass } from './types';

export interface ExecutionStep {
    global: boolean;
    priority: number;
    transport: ExecutionTransport;
    target: Constructor;
    propertyKey: string | symbol;
    type: ExecutionStepType;
}
export interface HandleExecutionStep extends ExecutionStep {
    type: ExecutionStepType.Middleware;
}
export interface CheckExecutionStep extends ExecutionStep {
    type: ExecutionStepType.Guard;
}
export interface BeforeExecutionStep extends ExecutionStep {
    type: ExecutionStepType.Interceptor;
    scope: ExecutionStepScope.Before;
}
export interface AfterExecutionStep extends ExecutionStep {
    type: ExecutionStepType.Interceptor;
    scope: ExecutionStepScope.After;
}
export interface CatchExecutionStep extends ExecutionStep {
    type: ExecutionStepType.Filter;
    acceptedErrors: ErrorClass[];
}
