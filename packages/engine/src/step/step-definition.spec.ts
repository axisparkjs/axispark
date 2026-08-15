import { ClassType } from '@axisparkjs/common';
import { StepMethodMetadata, StepTargetMetadata } from '../metadata';
import { ExecutionTransport } from '../execution';
import {
    StepDefinition,
    StepType,
    StepScope,
    HandleStepDefinition,
    CheckStepDefinition,
    BeforeStepDefinition,
    AfterStepDefinition,
    CatchStepDefinition
} from './step-definition';

describe('StepDefinition', () => {
    class Target {}

    describe('constructor', () => {
        it('should create a global step with the provided priority', () => {
            const step = new HandleStepDefinition(true, 100, ExecutionTransport.Http, Target, 'execute', StepType.Middleware);

            expect(step.global).toBe(true);
            expect(step.priority).toBe(100);
            expect(step.transport).toBe(ExecutionTransport.Http);
            expect(step.target).toBe(Target);
            expect(step.propertyKey).toBe('execute');
            expect(step.type).toBe(StepType.Middleware);
        });

        it('should set priority to zero for a non-global step', () => {
            const step = new HandleStepDefinition(false, 100, ExecutionTransport.Http, Target, 'execute', StepType.Middleware);

            expect(step.global).toBe(false);
            expect(step.priority).toBe(0);
        });

        it('should preserve a priority of zero for a global step', () => {
            const step = new HandleStepDefinition(true, 0, ExecutionTransport.Http, Target, 'execute', StepType.Middleware);

            expect(step.priority).toBe(0);
        });
    });

    describe('fromMetadata', () => {
        it('should create a HandleStep for middleware metadata', () => {
            const stepMethodMetadata: StepMethodMetadata = {
                type: StepType.Middleware,
                target: Target,
                propertyKey: 'execute'
            };

            const stepTargetMetadata: StepTargetMetadata = {
                type: StepType.Middleware,
                global: true,
                priority: 100,
                transport: ExecutionTransport.Http,
                target: Target
            };

            const step = StepDefinition.fromMetadata(stepMethodMetadata, stepTargetMetadata);

            expect(step).toBeInstanceOf(HandleStepDefinition);
            expect(step).toEqual(
                expect.objectContaining({
                    global: true,
                    priority: 100,
                    transport: ExecutionTransport.Http,
                    target: Target,
                    propertyKey: 'execute',
                    type: StepType.Middleware
                })
            );
        });

        it('should create a CheckStep for guard metadata', () => {
            const stepMethodMetadata: StepMethodMetadata = {
                type: StepType.Guard,
                target: Target,
                propertyKey: 'check'
            };

            const stepTargetMetadata: StepTargetMetadata = {
                type: StepType.Guard,
                global: true,
                priority: 50,
                transport: ExecutionTransport.Http,
                target: Target
            };

            const step = StepDefinition.fromMetadata(stepMethodMetadata, stepTargetMetadata);

            expect(step).toBeInstanceOf(CheckStepDefinition);
            expect(step).toEqual(
                expect.objectContaining({
                    global: true,
                    priority: 50,
                    transport: ExecutionTransport.Http,
                    target: Target,
                    propertyKey: 'check',
                    type: StepType.Guard
                })
            );
        });

        it('should create a BeforeStep for a before interceptor', () => {
            const stepMethodMetadata: StepMethodMetadata = {
                type: StepType.Interceptor,
                scope: StepScope.Before,
                target: Target,
                propertyKey: 'before'
            };

            const stepTargetMetadata: StepTargetMetadata = {
                type: StepType.Interceptor,
                global: true,
                target: Target,
                priority: 20,
                transport: ExecutionTransport.Http
            };

            const step = StepDefinition.fromMetadata(stepMethodMetadata, stepTargetMetadata);

            expect(step).toBeInstanceOf(BeforeStepDefinition);
            expect(step).toEqual(
                expect.objectContaining({
                    global: true,
                    priority: 20,
                    transport: ExecutionTransport.Http,
                    target: Target,
                    propertyKey: 'before',
                    type: StepType.Interceptor,
                    scope: StepScope.Before
                })
            );
        });

        it('should create an AfterStep for an after interceptor', () => {
            const stepMethodMetadata: StepMethodMetadata = {
                type: StepType.Interceptor,
                scope: StepScope.After,
                target: Target,
                propertyKey: 'after'
            };

            const stepTargetMetadata: StepTargetMetadata = {
                type: StepType.Interceptor,
                global: true,
                target: Target,
                priority: 30,
                transport: ExecutionTransport.Http
            };

            const step = StepDefinition.fromMetadata(stepMethodMetadata, stepTargetMetadata);

            expect(step).toBeInstanceOf(AfterStepDefinition);
            expect(step).toEqual(
                expect.objectContaining({
                    global: true,
                    priority: 30,
                    transport: ExecutionTransport.Http,
                    target: Target,
                    propertyKey: 'after',
                    type: StepType.Interceptor,
                    scope: StepScope.After
                })
            );
        });

        it('should create a CatchStep for filter metadata', () => {
            class ErrorOne extends Error {}
            class ErrorTwo extends Error {}

            const acceptedErrors: ClassType<Error>[] = [ErrorOne, ErrorTwo];

            const stepMethodMetadata: StepMethodMetadata = {
                type: StepType.Filter,
                target: Target,
                propertyKey: 'catch',
                acceptedErrors
            };

            const stepTargetMetadata: StepTargetMetadata = {
                type: StepType.Filter,
                global: true,
                target: Target,
                priority: 40,
                transport: ExecutionTransport.Http
            };

            const step = StepDefinition.fromMetadata(stepMethodMetadata, stepTargetMetadata);

            expect(step).toBeInstanceOf(CatchStepDefinition);
            expect(step).toEqual(
                expect.objectContaining({
                    global: true,
                    priority: 40,
                    transport: ExecutionTransport.Http,
                    target: Target,
                    propertyKey: 'catch',
                    type: StepType.Filter,
                    acceptedErrors
                })
            );
        });

        it('should set priority to zero when creating a local step', () => {
            const stepMethodMetadata: StepMethodMetadata = {
                type: StepType.Guard,
                target: Target,
                propertyKey: 'check'
            };

            const stepTargetMetadata: StepTargetMetadata = {
                type: StepType.Guard,
                target: Target,
                global: false,
                priority: 100,
                transport: ExecutionTransport.Http
            };

            const step = StepDefinition.fromMetadata(stepMethodMetadata, stepTargetMetadata);

            expect(step).toBeInstanceOf(CheckStepDefinition);
            expect(step.global).toBe(false);
            expect(step.priority).toBe(0);
        });
    });

    describe('HandleStep', () => {
        it('should always have middleware type', () => {
            const step = new HandleStepDefinition(true, 10, ExecutionTransport.Http, Target, 'execute', StepType.Middleware);

            expect(step.type).toBe(StepType.Middleware);
        });
    });

    describe('CheckStep', () => {
        it('should always have guard type', () => {
            const step = new CheckStepDefinition(true, 10, ExecutionTransport.Http, Target, 'check', StepType.Guard);

            expect(step.type).toBe(StepType.Guard);
        });
    });

    describe('BeforeStep', () => {
        it('should have before scope', () => {
            const step = new BeforeStepDefinition(true, 10, ExecutionTransport.Http, Target, 'before', StepType.Interceptor, StepScope.Before);

            expect(step.type).toBe(StepType.Interceptor);
            expect(step.scope).toBe(StepScope.Before);
        });
    });

    describe('AfterStep', () => {
        it('should have after scope', () => {
            const step = new AfterStepDefinition(true, 10, ExecutionTransport.Http, Target, 'after', StepType.Interceptor, StepScope.After);

            expect(step.type).toBe(StepType.Interceptor);
            expect(step.scope).toBe(StepScope.After);
        });
    });

    describe('CatchStep', () => {
        it('should preserve accepted errors', () => {
            class ValidationError extends Error {}
            class AuthorizationError extends Error {}

            const acceptedErrors: ClassType<Error>[] = [ValidationError, AuthorizationError];

            const step = new CatchStepDefinition(true, 10, ExecutionTransport.Http, Target, 'catch', StepType.Filter, acceptedErrors);

            expect(step.type).toBe(StepType.Filter);
            expect(step.acceptedErrors).toBe(acceptedErrors);
        });

        it('should support an empty accepted errors list', () => {
            const acceptedErrors: ClassType<Error>[] = [];

            const step = new CatchStepDefinition(true, 10, ExecutionTransport.Http, Target, 'catch', StepType.Filter, acceptedErrors);

            expect(step.acceptedErrors).toEqual([]);
        });
    });
});
