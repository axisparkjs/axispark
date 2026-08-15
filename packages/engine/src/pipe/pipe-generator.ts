import { Generator, Metadata, MetadataKeys } from '@axisparkjs/common';
import { PipeMetadata } from '../metadata';
import { ExecutionHandler } from '../execution';
import { PipeScope } from './pipe-scope';
import { PipeDefinition } from './pipe-definition';
import { ParameterDefinition } from '../parameter';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class PipeGenerator implements Generator<PipeDefinition[]> {
    async generate(parameters: ParameterDefinition[], handler: ExecutionHandler): Promise<PipeDefinition[]> {
        const classPipes = Metadata.get<PipeMetadata[]>(MetadataKeys.PIPE, handler.target) ?? [];
        const methodPipes = (Metadata.get<PipeMetadata[]>(MetadataKeys.PIPE, handler.target, handler.propertyKey) ?? []).filter(
            (x) => x.pipeScope === PipeScope.Method
        );
        const parameterPipes = (Metadata.get<PipeMetadata[]>(MetadataKeys.PIPE, handler.target, handler.propertyKey) ?? []).filter(
            (x) => x.pipeScope === PipeScope.Parameter
        );

        const pipes: PipeDefinition[] = [];
        for (const parameter of parameters) {
            const finalPipes = [...classPipes, ...methodPipes, ...parameterPipes.filter((x) => x.parameterIndex === parameter.parameterIndex)];
            const pipeSteps = [];
            for (const pipe of finalPipes) {
                for (const step of pipe.steps) {
                    const config = {
                        pipeStep: 'pipeStep' in step ? step.pipeStep : step,
                        PipeStepConfig: 'PipeStepConfig' in step ? step.PipeStepConfig : undefined
                    };
                    pipeSteps.push(config);
                }
            }
            pipes.push(new PipeDefinition(parameter, pipeSteps));
        }
        return pipes;
    }
}
