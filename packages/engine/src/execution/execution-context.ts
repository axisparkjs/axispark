import { ExecutionTransport } from './execution-transport';

export interface ExecutionContext {
    error?: Error;
    transport: ExecutionTransport;
}
