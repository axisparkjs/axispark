import { PipeScope } from '../pipe-scope';
import { PipeStepClass } from '../pipe-step';
import { PipeStepParameters } from '../pipe-step-parameters';

export interface PipeMetadata {
    index?: number;
    scope: PipeScope;
    steps: (PipeStepClass | { pipeStep: PipeStepClass; pipeStepParameters: PipeStepParameters })[];
    propertyKey?: string | symbol;
}
