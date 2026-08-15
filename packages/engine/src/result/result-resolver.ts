import { Resolver } from '@axisparkjs/common';
import { ExecutionContext } from '../execution';
import { ResultDefinition } from './result-definition';

export abstract class ResultResolver implements Resolver<ResultDefinition> {
    abstract resolve(result: unknown, context: ExecutionContext): Promise<ResultDefinition> | ResultDefinition;
}
