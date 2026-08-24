import { ScopedContainer } from '@axisparkjs/di';
import { ExecutionTransport } from './execution-transport';
import { ExecutionHandler } from './execution-handler';

/**
 * An interface representing the execution context for a request of any kind. It extends the `ExecutionHandler` interface and includes additional properties such as `error`, `transport`, and `scopedContainer`. The `error` property is optional and can hold an error object if an error occurred during execution. The `transport` property indicates the transport mechanism used for the execution, and the `scopedContainer` property provides access to a scoped dependency injection container for managing dependencies within the execution context.
 */
export interface ExecutionContext extends ExecutionHandler {
    error?: Error;
    transport: ExecutionTransport;
    scopedContainer: ScopedContainer;
}
