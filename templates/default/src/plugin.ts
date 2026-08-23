import { Plugin } from '@axisparkjs/core';
import { Injectable } from '@axisparkjs/di';
import { Logger } from '@axisparkjs/logger';

export const registerText = 'HelloWorldPlugin registered';
export const startText = 'HelloWorldPlugin started';
export const stopText = 'HelloWorldPlugin stopped';

@Injectable()
export class HelloWorldPlugin extends Plugin {
    constructor(private readonly logger: Logger) {
        super();
    }

    async onRegister() {
        await this.logger.info(registerText);
    }

    async onStart() {
        await this.logger.info(startText);
    }

    async onStop() {
        await this.logger.info(stopText);
    }
}
