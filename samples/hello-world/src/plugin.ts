import { Pluggable, Plugin } from '@axisparkjs/core';
import { Logger } from '@axisparkjs/logger';

export const registerText = 'HelloWorldPlugin registered';
export const startText = 'HelloWorldPlugin started';
export const stopText = 'HelloWorldPlugin stopped';

@Plugin()
export class HelloWorldPlugin implements Pluggable {
    constructor(private readonly logger: Logger) {}

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
