import { Executable } from '@axisparkjs/common';
import { ExecutionContext } from './execution-context';
import { HandlerInvoker } from './handler-invoker';
import { Injectable } from '@axisparkjs/di';
import { ResultProcessor, ResultDefinition } from '../result';
import { ExecutionPlanner } from './execution-planner';
import { TimeoutProcessor, TimeoutDefinition } from '../timeout';

@Injectable()
export class ExecutionEngine implements Executable {
    constructor(
        private readonly planGenerator: ExecutionPlanner,
        private readonly handlerInvoker: HandlerInvoker,
        private readonly timeoutProcessor: TimeoutProcessor,
        private readonly resultProcessor: ResultProcessor
    ) {}

    public async execute(context: ExecutionContext): Promise<void> {
        const plan = await this.planGenerator.plan(context);
        let result: unknown | ResultDefinition;
        try {
            const execution = async () => {
                for (const step of plan.before) await this.handlerInvoker.invoke(step, context);
                return await this.handlerInvoker.invoke(plan.context, context);
            };

            if (plan.timeout) {
                let finished = false;
                const timeout = async () => {
                    await new Promise<void>((resolve, reject) => {
                        setTimeout(
                            async () => {
                                if (finished) {
                                    resolve();
                                    return;
                                }

                                try {
                                    await this.timeoutProcessor.process(plan.timeout as TimeoutDefinition, context);
                                    resolve();
                                } catch (error) {
                                    reject(error);
                                }
                            },
                            (plan.timeout as TimeoutDefinition).time
                        );
                    });
                };

                try {
                    result = await Promise.race([execution(), timeout()]);
                } finally {
                    finished = true;
                }
            } else {
                result = await execution();
            }
        } catch (error) {
            context.error = error as Error;
            for (const step of plan.catch) {
                const accepts = step.acceptedErrors.some((accepted) => error instanceof accepted);
                if (!accepts) continue;

                result = await this.handlerInvoker.invoke(step, context);
                if (result !== undefined) break;
            }
        } finally {
            for (const step of plan.after) await this.handlerInvoker.invoke(step, context);
        }

        await this.resultProcessor.process(result, context);
    }
}
