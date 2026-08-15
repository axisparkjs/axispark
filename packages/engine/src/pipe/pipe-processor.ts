import { Processable } from '@axisparkjs/common';
import { ExecutionContext } from '../execution';
import { PipeDefinition } from './pipe-definition';
import { Injectable, Injector } from '@axisparkjs/di';

@Injectable()
export class PipeProcessor implements Processable {
    constructor(private readonly injector: Injector) {}

    async process(pipes: PipeDefinition[], context: ExecutionContext): Promise<any[]> {
        const results: any[] = [];

        for (const pipe of pipes) {
            const parameter = pipe.parameter;
            for (const step of pipe.steps) {
                const pipeStep = await this.injector.get(step.pipeStep, context.scopedContainer);
                const value = await pipeStep.execute(parameter, step.pipeStepConfig);
                parameter.setValue(value);
            }
            results.push(parameter.value);
        }
        return results;
    }
}
