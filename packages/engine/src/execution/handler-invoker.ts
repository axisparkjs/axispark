import { Injectable, Injector } from '@axisparkjs/di';
import { ExecutionContext } from './execution-context';
import { ExecutionHandler } from './execution-handler';
import { ParameterGenerator } from '../parameter';
import { PipeGenerator, PipeProcessor } from '../pipe';

@Injectable()
export class HandlerInvoker {
    constructor(
        private readonly parameterGenerator: ParameterGenerator,
        private readonly pipeGenerator: PipeGenerator,
        private readonly pipeProcessor: PipeProcessor,
        private readonly injector: Injector
    ) {}

    public async invoke(handler: ExecutionHandler, context: ExecutionContext): Promise<unknown> {
        const paramters = this.parameterGenerator.generate(context, handler);
        const pipes = await this.pipeGenerator.generate(paramters, handler);
        const args = await this.pipeProcessor.process(pipes, context);

        const instance = await this.injector.get<any>(handler.target, context.scopedContainer);
        return instance[handler.propertyKey](...args);
    }
}
