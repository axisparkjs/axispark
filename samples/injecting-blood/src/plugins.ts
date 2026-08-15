import { AxiSparkContext, Plugin } from '@axisparkjs/core';
import { Logger } from '@axisparkjs/logger';
import { Dependecy1, Dependecy2, Dependecy3, Dependecy3Impl, DEPENDENCY_3_TOKEN } from './classes';
import { Inject, Injectable, InjectionToken, Injector } from '@axisparkjs/di';

@Injectable()
export class InjectingBlood1Plugin extends Plugin {
    static readonly token_exposed = new InjectionToken('dep2-as-token');

    constructor(
        private readonly logger: Logger,
        private readonly dep1: Dependecy1,
        private readonly dep2: Dependecy2,
        private readonly dep3impl: Dependecy3Impl,
        @Inject(DEPENDENCY_3_TOKEN) private readonly dep3: Dependecy3
    ) {
        super();
    }

    async onRegister(context: AxiSparkContext) {
        context.container.bind({ token: InjectingBlood1Plugin.token_exposed, useValue: this.dep2 });

        await this.logger.info(`InjectingBlood1Plugin logger: ${this.logger !== undefined}`);
        await this.logger.info(`InjectingBlood1Plugin dep1: ${this.dep1 !== undefined}`);
        await this.logger.info(`InjectingBlood1Plugin dep2: ${this.dep2 !== undefined}`);
        await this.logger.info(`InjectingBlood1Plugin dep3impl: ${this.dep3impl !== undefined}`);
        await this.logger.info(`InjectingBlood1Plugin dep3: ${this.dep3 !== undefined}`);
        await this.logger.info('InjectingBlood1Plugin registered');
    }
}

@Injectable()
export class InjectingBlood2Plugin extends Plugin {
    static readonly dependencies = [InjectingBlood1Plugin];
    static readonly token_exposed = new InjectionToken('dep2-as-token');
    public dep2FromPlugin!: Dependecy2;

    constructor(private readonly logger: Logger) {
        super();
    }

    async onRegister(context: AxiSparkContext) {
        this.dep2FromPlugin = await context.container.resolve(InjectingBlood1Plugin.token_exposed);

        await this.logger.info(`InjectingBlood2Plugin logger: ${this.logger !== undefined}`);
        await this.logger.info(`InjectingBlood2Plugin dep2FromPlugin: ${this.dep2FromPlugin !== undefined}`);
        await this.logger.info('InjectingBlood2Plugin registered');
    }
}

@Injectable()
export class InjectingBlood3Plugin extends Plugin {
    public dep1FromInjector!: Dependecy1;
    public dep3FromInjector!: Dependecy3;

    constructor(
        private readonly logger: Logger,
        private readonly injector: Injector
    ) {
        super();
    }

    async onRegister() {
        this.dep1FromInjector = this.injector.get(Dependecy1);
        this.dep3FromInjector = this.injector.get(DEPENDENCY_3_TOKEN);

        await this.logger.info(`InjectingBlood3Plugin logger: ${this.logger !== undefined}`);
        await this.logger.info(`InjectingBlood3Plugin dep1FromInjector: ${this.dep1FromInjector !== undefined}`);
        await this.logger.info(`InjectingBlood3Plugin dep3FromInjector: ${this.dep3FromInjector !== undefined}`);
        await this.logger.info('InjectingBlood3Plugin registered');
    }
}
