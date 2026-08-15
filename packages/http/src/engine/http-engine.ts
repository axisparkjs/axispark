import { Executable } from '@axisparkjs/common';
import { HttpContext } from '../types';
import { Injectable } from '@axisparkjs/di';
import { ExecutionEngine } from '@axisparkjs/engine';
import { VersionGenerator, VersionProcessor } from '../version';

@Injectable()
export class HttpEngine implements Executable {
    constructor(
        private readonly executionEngine: ExecutionEngine,
        private readonly versionGenerator: VersionGenerator,
        private readonly versionProcessor: VersionProcessor
    ) {}

    public async execute(context: HttpContext): Promise<void> {
        const versionDefinition = this.versionGenerator.generate(context);
        this.versionProcessor.process(versionDefinition, context);

        await this.executionEngine.execute(context);
    }
}
