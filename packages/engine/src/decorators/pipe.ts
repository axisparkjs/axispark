import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { PipeMetadata } from '../metadata/pipe-metadata';
import { PipeStepConfig, PipeScope, PipeStep } from '../pipe';
import { ClassType } from '@axisparkjs/common';

export function Pipe(
    ...steps: (ClassType<PipeStep> | { pipeStep: ClassType<PipeStep>; PipeStepConfig: PipeStepConfig })[]
): ClassDecorator & MethodDecorator & ParameterDecorator {
    return (...args: any[]) => {
        // Clase
        if (args.length === 1) {
            const [target] = args;

            const pipes = Metadata.get<PipeMetadata[]>(MetadataKeys.PIPE, target) ?? [];

            pipes.push({
                target: Metadata.normalizeTarget(target),
                pipeScope: PipeScope.Class,
                steps
            });

            Metadata.define(MetadataKeys.PIPE, pipes, target);
            return;
        }

        const [target, propertyKey, third] = args;
        const pipes = Metadata.get<PipeMetadata[]>(MetadataKeys.PIPE, target, propertyKey) ?? [];

        // Parámetro
        if (typeof third === 'number') {
            pipes.push({
                target: Metadata.normalizeTarget(target),
                propertyKey,
                parameterIndex: third,
                pipeScope: PipeScope.Parameter,
                steps
            });

            Metadata.define(MetadataKeys.PIPE, pipes, target, propertyKey);

            return;
        }

        // Método
        pipes.push({
            target: Metadata.normalizeTarget(target),
            propertyKey,
            pipeScope: PipeScope.Method,
            steps
        });

        Metadata.define(MetadataKeys.PIPE, pipes, target, propertyKey);
    };
}
