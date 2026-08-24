import { ClassType } from '@axisparkjs/common';

/**
 * An interface representing the execution handler for a specific target and property key. It includes the target class type and the property key (method name or symbol) associated with the execution handler. This interface is used to define the context in which execution steps are handled, allowing for the management of execution flows within a specific class and method.
 */
export interface ExecutionHandler {
    target: ClassType;
    propertyKey: string | symbol;
}
