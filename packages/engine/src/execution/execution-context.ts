import { ScopedContainer } from '@axisparkjs/di';
import { ExecutionTransport } from './execution-transport';
import { ExecutionHandler } from './execution-handler';

export interface ExecutionContext extends ExecutionHandler {
    error?: Error;
    transport: ExecutionTransport;
    scopedContainer: ScopedContainer;
}
