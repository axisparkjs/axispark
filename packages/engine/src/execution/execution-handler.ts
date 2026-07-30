import { Constructor } from '@axisparkjs/di';

export interface ExecutionHandler {
    target: Constructor;
    method: string | symbol;
}
