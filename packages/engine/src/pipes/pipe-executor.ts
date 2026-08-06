import { Executable, Metadata, MetadataKeys } from '@axisparkjs/common';
import { PipeMetadata } from './metadata';
import { PipeExecutionContext } from './pipe-execution-context';
import { ExecutionHandler, ExecutionCore } from '../execution';
import { PipeScope } from './pipe-scope';
import { PipeStepExecutionContext } from './pipe-step-execution-context';

class PipeExecutorStatic implements Executable {
    execute(context: PipeExecutionContext, handler: ExecutionHandler, core: ExecutionCore): any[] {
        const classPipes = Metadata.get<PipeMetadata[]>(MetadataKeys.PIPE, handler.target) ?? [];
        const methodPipes = Metadata.get<PipeMetadata[]>(MetadataKeys.PIPE, handler.target, handler.method) ?? [];
        let pipes = [...classPipes, ...methodPipes.filter((x) => x.scope === PipeScope.Method)];

        context.args.forEach((value, index) => {
            pipes = [...methodPipes.filter((x) => x.scope === PipeScope.Parameter && x.index === index)];

            const executionContext: PipeStepExecutionContext = {
                parameter: handler.method,
                index,
                originalValue: context.args[index],
                transport: context.transport
            };

            for (const pipe of pipes) {
                for (const step of pipe.steps) {
                    const config = {
                        pipeStepClass: 'pipeStep' in step ? step.pipeStep : step,
                        pipeStepParameters: 'pipeStepParameters' in step ? step.pipeStepParameters : undefined
                    };
                    const pipeStep = core.container.resolve(config.pipeStepClass);
                    value = pipeStep.execute(value, executionContext, config.pipeStepParameters);
                }
            }

            context.args[index] = value;
        });

        return context.args;
    }
}

export const PipeExecutor = new PipeExecutorStatic();
