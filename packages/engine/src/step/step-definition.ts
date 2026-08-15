import { ClassType } from '@axisparkjs/common';
import { ExecutionTransport, ExecutionHandler } from '../execution';
import { StepMethodMetadata, StepTargetMetadata } from '../metadata';

export enum StepType {
    Guard = 'guard',
    Middleware = 'middleware',
    Interceptor = 'interceptor',
    Filter = 'filter'
}

export enum StepScope {
    Before = 'before',
    After = 'after'
}

export abstract class StepDefinition implements ExecutionHandler {
    public constructor(
        public readonly global: boolean,
        public readonly priority: number,
        public readonly transport: ExecutionTransport,
        public readonly target: ClassType,
        public readonly propertyKey: string | symbol,
        public readonly type: StepType
    ) {
        if (!this.global) this.priority = 0;
    }

    public static fromMetadata(sMM: StepMethodMetadata, sTM: StepTargetMetadata): StepDefinition {
        switch (sMM.type) {
            case StepType.Middleware:
                return new HandleStepDefinition(sTM.global, sTM.priority, sTM.transport, sMM.target, sMM.propertyKey, sMM.type);
            case StepType.Guard:
                return new CheckStepDefinition(sTM.global, sTM.priority, sTM.transport, sMM.target, sMM.propertyKey, sMM.type);
            case StepType.Interceptor:
                if (sMM.scope === StepScope.Before)
                    return new BeforeStepDefinition(sTM.global, sTM.priority, sTM.transport, sMM.target, sMM.propertyKey, sMM.type, sMM.scope);
                else return new AfterStepDefinition(sTM.global, sTM.priority, sTM.transport, sMM.target, sMM.propertyKey, sMM.type, sMM.scope);
            case StepType.Filter:
                return new CatchStepDefinition(sTM.global, sTM.priority, sTM.transport, sMM.target, sMM.propertyKey, sMM.type, sMM.acceptedErrors);
        }
    }
}
export class HandleStepDefinition extends StepDefinition {
    override readonly type: StepType.Middleware;
}
export class CheckStepDefinition extends StepDefinition {
    override readonly type: StepType.Guard;
}
export class BeforeStepDefinition extends StepDefinition {
    override readonly type: StepType.Interceptor;

    public constructor(
        global: boolean,
        priority: number,
        transport: ExecutionTransport,
        target: ClassType,
        propertyKey: string | symbol,
        type: StepType.Interceptor,
        public readonly scope: StepScope.Before
    ) {
        super(global, priority, transport, target, propertyKey, type);
    }
}
export class AfterStepDefinition extends StepDefinition {
    override readonly type: StepType.Interceptor;

    public constructor(
        global: boolean,
        priority: number,
        transport: ExecutionTransport,
        target: ClassType,
        propertyKey: string | symbol,
        type: StepType.Interceptor,
        public readonly scope: StepScope.After
    ) {
        super(global, priority, transport, target, propertyKey, type);
    }
}
export class CatchStepDefinition extends StepDefinition {
    override readonly type: StepType.Filter;

    public constructor(
        global: boolean,
        priority: number,
        transport: ExecutionTransport,
        target: ClassType,
        propertyKey: string | symbol,
        type: StepType.Filter,
        public readonly acceptedErrors: ClassType<Error>[]
    ) {
        super(global, priority, transport, target, propertyKey, type);
    }
}
