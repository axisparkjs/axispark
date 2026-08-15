import { Resolver } from '@axisparkjs/common';
import { TimeoutDefinition } from './timeout-definition';

export interface TimeoutResolver extends Resolver<void> {
    resolve(timeout: TimeoutDefinition): Promise<void> | void;
}
