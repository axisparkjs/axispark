import { ExecutionStepType } from '../execution-step-type';
import { ExecutionTransport } from '../../execution';

export interface ExecutionStepTargetMetadata {
    global: boolean;
    priority: number;
    transport: ExecutionTransport;
    type: ExecutionStepType;
}
