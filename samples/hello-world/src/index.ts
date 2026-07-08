import { AxisparkFactory, Pluggable, Plugin } from '@axisparkjs/core';
import { ConsoleTransport, SimpleFormatter, LogLevel, Logger } from '@axisparkjs/logger';

const keepAlive = setInterval(() => {}, 1 << 30); // ~12 días
const app = AxisparkFactory.create({
    name: 'Hello World App',
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.INFO,
            formatter: new SimpleFormatter()
        })
    ]
});

@Plugin()
class HelloWorldPlugin implements Pluggable {
    constructor(private readonly logger: Logger) {}

    async onRegister() {
        await this.logger.info('HelloWorldPlugin registered');
    }

    async onStart() {
        await this.logger.info('HelloWorldPlugin started');
    }

    async onStop() {
        await this.logger.info('HelloWorldPlugin stopped');
    }
}

const bootstrap = async () => {
    try {
        app.use(HelloWorldPlugin);
        await app.init();
        await app.run();
    } finally {
        await app.destroy();
        clearInterval(keepAlive);
    }
};

bootstrap().catch(() => {
    process.exit(1);
});
