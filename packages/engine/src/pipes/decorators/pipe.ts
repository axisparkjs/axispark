import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { PipeMetadata } from '../metadata/pipe-metadata';
import { PipeStepClass } from '../pipe-step';
import { PipeStepParameters } from '../pipe-step-parameters';
import { PipeScope } from '../pipe-scope';

export function Pipe(...steps: (PipeStepClass | { pipeStep: PipeStepClass; pipeStepParameters: PipeStepParameters })[]): ClassDecorator & MethodDecorator & ParameterDecorator {
    return (...args: any[]) => {
        // Clase
        if (args.length === 1) {
            const [target] = args;

            const pipes = Metadata.get<PipeMetadata[]>(MetadataKeys.PIPE, target) ?? [];

            pipes.push({
                scope: PipeScope.Class,
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
                scope: PipeScope.Parameter,
                propertyKey,
                index: third,
                steps
            });

            Metadata.define(MetadataKeys.PIPE, pipes, target, propertyKey);

            return;
        }

        // Método
        pipes.push({
            scope: PipeScope.Method,
            propertyKey,
            steps
        });

        Metadata.define(MetadataKeys.PIPE, pipes, target, propertyKey);
    };
}
