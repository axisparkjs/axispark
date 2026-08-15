import { ClassType } from '@axisparkjs/common';

export interface ExecutionHandler {
    target: ClassType;
    propertyKey: string | symbol;
}
