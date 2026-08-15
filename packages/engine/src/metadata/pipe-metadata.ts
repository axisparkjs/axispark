import { ClassType } from '@axisparkjs/common';
import { PipeScope, PipeStep, PipeStepConfig } from '../pipe';
import { MetadataFromClassMethodOrParameter } from '@axisparkjs/common';

export interface PipeMetadata extends MetadataFromClassMethodOrParameter {
    pipeScope: PipeScope;
    steps: (ClassType<PipeStep> | { pipeStep: ClassType<PipeStep>; PipeStepConfig: PipeStepConfig })[];
}
