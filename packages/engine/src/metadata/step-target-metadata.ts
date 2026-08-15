import { MetadataFromClass } from '@axisparkjs/common';
import { ExecutionTransport } from '../execution';
import { StepType } from '../step';

export interface StepTargetMetadata extends MetadataFromClass {
    global: boolean;
    priority: number;
    transport: ExecutionTransport;
    type: StepType;
}
