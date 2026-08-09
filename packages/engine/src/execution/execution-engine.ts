import { Executable, Initializable } from '@axisparkjs/common';
import { ExecutionContext } from './execution-context';
import { ExecutionHandler } from './execution-handler';
import { ExecutionCore } from './execution-core';
import { ExecutionStepsGenerator } from '../execution-steps/execution-steps-generator';
import { ExecutionStepType } from '../execution-steps/execution-step-type';
import { ExecutionStepScope } from '../execution-steps/execution-step-scope';
import { ExecutionInvoker } from './execution-invoker';
import { BeforeExecutionStep, AfterExecutionStep, CatchExecutionStep, ExecutionStep } from '../execution-steps/execution-step';
import { ExecutionPlan } from './execution-plan';
import { ExecutionTransport } from './execution-transport';
import { ErrorClass } from '../execution-steps/types';

export class ExecutionEngine implements Executable, Initializable {
    private readonly registeredSteps = new Map<string, ExecutionPlan>();

    public init(): void {
        ExecutionStepsGenerator.init();
    }

    public async execute(context: ExecutionContext, handler: ExecutionHandler, core: ExecutionCore): Promise<void> {
        const key = `${handler.target.name}.${String(handler.method)}`;
        let plan = this.registeredSteps.get(key);
        if (!plan) {
            plan = this.generatePlan(context, ExecutionStepsGenerator.generate(handler), handler);
            this.registeredSteps.set(key, plan);
        }

        const executionResult = await ExecutionInvoker.invoke(context, core, plan);
        await core.resultProcessor.process(context, handler, executionResult);
    }

    private stepToExecutionHandler(step: ExecutionStep): ExecutionHandler {
        return { target: step.target, method: step.propertyKey };
    }

    private getSteps(steps: ExecutionStep[], type: ExecutionStepType, global: boolean) {
        return steps.filter((step) => step.type === type && step.global === global);
    }

    private prepareSteps(context: ExecutionContext, steps: ExecutionStep[]): { globalSteps: ExecutionStep[]; usingSteps: ExecutionStep[] } {
        const validSteps = steps.filter((step) => step.transport === ExecutionTransport.All || step.transport === context.transport);
        const globalSteps = validSteps.filter((step) => step.global).sort((a, b) => b.priority - a.priority); // Prioridad descendente
        const usingSteps = validSteps.filter((step) => !step.global);
        return { globalSteps, usingSteps };
    }

    private generateBefore(steps: { globalSteps: ExecutionStep[]; usingSteps: ExecutionStep[] }): ExecutionHandler[] {
        const before: ExecutionHandler[] = [];

        const globalMiddlewares = this.getSteps(steps.globalSteps, ExecutionStepType.Middleware, true);
        before.push(...globalMiddlewares.map(this.stepToExecutionHandler));
        const usingMiddlewares = this.getSteps(steps.usingSteps, ExecutionStepType.Middleware, false);
        before.push(...usingMiddlewares.map(this.stepToExecutionHandler));

        const globalGuards = this.getSteps(steps.globalSteps, ExecutionStepType.Guard, true);
        before.push(...globalGuards.map(this.stepToExecutionHandler));
        const usingGuards = this.getSteps(steps.usingSteps, ExecutionStepType.Guard, false);
        before.push(...usingGuards.map(this.stepToExecutionHandler));

        const globalInterceptors = this.getSteps(steps.globalSteps, ExecutionStepType.Interceptor, true);
        const usingInterceptors = this.getSteps(steps.usingSteps, ExecutionStepType.Interceptor, false);
        const interceptors = [...globalInterceptors, ...usingInterceptors] as BeforeExecutionStep[];
        before.push(...interceptors.filter((step) => step.scope === ExecutionStepScope.Before).map(this.stepToExecutionHandler));

        return before;
    }

    private generateAfter(steps: { globalSteps: ExecutionStep[]; usingSteps: ExecutionStep[] }): ExecutionHandler[] {
        const after: ExecutionHandler[] = [];

        const globalInterceptors = this.getSteps(steps.globalSteps, ExecutionStepType.Interceptor, true);
        const usingInterceptors = this.getSteps(steps.usingSteps, ExecutionStepType.Interceptor, false);
        const interceptors = [...globalInterceptors, ...usingInterceptors] as AfterExecutionStep[];
        const interceptorsReverse = interceptors.toReversed();
        after.push(...interceptorsReverse.filter((step) => step.scope === ExecutionStepScope.After).map(this.stepToExecutionHandler));

        return after;
    }

    private generateFilters(steps: { globalSteps: ExecutionStep[]; usingSteps: ExecutionStep[] }): { executionHandler: ExecutionHandler; acceptedErrors: ErrorClass[] }[] {
        const filters: { executionHandler: ExecutionHandler; acceptedErrors: ErrorClass[] }[] = [];

        const globalFilters = this.getSteps(steps.globalSteps, ExecutionStepType.Filter, true);
        const usingFilters = this.getSteps(steps.usingSteps, ExecutionStepType.Filter, false);
        const allFilters = [...globalFilters.toReversed(), ...usingFilters.toReversed()].toReversed() as CatchExecutionStep[];
        filters.push(...allFilters.map((step) => ({ executionHandler: { target: step.target, method: step.propertyKey }, acceptedErrors: step.acceptedErrors })));

        return filters;
    }

    private generatePlan(context: ExecutionContext, steps: ExecutionStep[], handler: ExecutionHandler): ExecutionPlan {
        const preparedSteps = this.prepareSteps(context, steps);
        const before = this.generateBefore(preparedSteps);
        const after = this.generateAfter(preparedSteps);
        const filters = this.generateFilters(preparedSteps);

        return { before, after, filters, handler };
    }
}
