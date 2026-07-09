import { app } from './app';

const bootstrap = async () => {
    const keepAlive = setInterval(() => {}, 1 << 30); // ~12 días
    try {
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
