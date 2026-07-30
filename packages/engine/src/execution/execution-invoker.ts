import { ExecutionContext } from './execution-context';
import { ExecutionCore } from './execution-core';
import { ExecutionHandler } from './execution-handler';
import { ExecutionPlan } from './execution-plan';
import { ParametersResolver } from '../parameters';
import { PipeExecutor } from '../pipes';

class ExecutionInvokerStatic {
    public async invoke(context: ExecutionContext, core: ExecutionCore, plan: ExecutionPlan): Promise<unknown> {
        const { before, handler, after, filters } = plan;

        try {
            await this.invokeHandlers(before, context, core);
            return await this.invokeHandler(handler, context, core);
        } catch (error) {
            context.error = error as Error;
            return this.invokeFilters(filters, context, core);
        } finally {
            await this.invokeHandlers(after, context, core);
        }
    }

    private async invokeHandlers(handlers: ExecutionHandler[], context: ExecutionContext, core: ExecutionCore): Promise<void> {
        for (const handler of handlers) await this.invokeHandler(handler, context, core);
    }

    private async invokeFilters(
        filters: {
            executionHandler: ExecutionHandler;
            acceptedErrors: any[];
        }[],
        context: ExecutionContext,
        core: ExecutionCore
    ): Promise<unknown> {
        for (const filter of filters) {
            const handlesError = filter.acceptedErrors.some((accepted) => context.error instanceof accepted);
            if (!handlesError) continue;

            const result = await this.invokeHandler(filter.executionHandler, context, core);
            if (result !== undefined) return result;
        }

        return undefined;
    }

    private async invokeHandler(handler: ExecutionHandler, context: ExecutionContext, core: ExecutionCore): Promise<unknown> {
        const instance = core.container.resolve<any>(handler.target);
        const args = PipeExecutor.execute(
            {
                ...context,
                args: ParametersResolver.resolve(context, handler)
            },
            handler,
            core
        );

        return instance[handler.method](...args);
    }
}

export const ExecutionInvoker = new ExecutionInvokerStatic();
