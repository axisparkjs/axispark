import { Container } from '@axisparkjs/di';
import { ExecutionResultProcessor } from '../execution-result/execution-result-processor';

export interface ExecutionCore {
    container: Container;
    processor: ExecutionResultProcessor;
}
