import { app } from './app-express';

const bootstrap = async () => {
    try {
        await app.init();
        await app.run();
    } catch (error) {
        console.error(error);
    } finally {
        await app.destroy();
    }
};

bootstrap().catch(() => {
    process.exit(1);
});
