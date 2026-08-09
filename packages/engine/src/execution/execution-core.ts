import { Container } from '@axisparkjs/di';
import { ExecutionResultProcessor } from '../execution-result/execution-result-processor';
import { ExecutionTimeoutProcessor } from '../execution-timeout';

export interface ExecutionCore {
    container: Container;
    resultProcessor: ExecutionResultProcessor;
    timeoutProcessor?: ExecutionTimeoutProcessor;
}
