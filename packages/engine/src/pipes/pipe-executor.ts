import { Executable, Metadata, MetadataKeys } from '@axisparkjs/common';
import { PipeMetadata } from './metadata';
import { PipeExecutionContext } from './pipe-execution-context';
import { ExecutionHandler, ExecutionCore } from '../execution';
import { PipeScope } from './pipe-scope';
import { PipeStepExecutionContext } from './pipe-step-execution-context';

class PipeExecutorStatic implements Executable {
    async execute(context: PipeExecutionContext, handler: ExecutionHandler, core: ExecutionCore): Promise<any[]> {
        const classPipes = Metadata.get<PipeMetadata[]>(MetadataKeys.PIPE, handler.target) ?? [];
        const methodPipes = Metadata.get<PipeMetadata[]>(MetadataKeys.PIPE, handler.target, handler.method) ?? [];
        const pipes = [...classPipes, ...methodPipes.filter((x) => x.scope === PipeScope.Method)];

        for (const [index, originalValue] of context.args.entries()) {
            const finalPipes = [...pipes, ...methodPipes.filter((x) => x.scope === PipeScope.Parameter && x.index === index)];
            let value = originalValue;

            const executionContext: PipeStepExecutionContext = {
                parameter: handler.method,
                index,
                originalValue,
                transport: context.transport,
                scope: context.scope
            };

            for (const pipe of finalPipes) {
                for (const step of pipe.steps) {
                    const config = {
                        pipeStepClass: 'pipeStep' in step ? step.pipeStep : step,
                        pipeStepParameters: 'pipeStepParameters' in step ? step.pipeStepParameters : undefined
                    };
                    const pipeStep = await core.container.resolve(config.pipeStepClass, executionContext.scope);
                    value = await pipeStep.execute(value, executionContext, config.pipeStepParameters);
                }
            }

            context.args[index] = value;
        }

        return context.args;
    }
}

export const PipeExecutor = new PipeExecutorStatic();
