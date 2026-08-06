import { app } from './app';

const bootstrap = async () => {
    try {
        await app.init();
        await app.run();
    } catch (err) {
        console.error(err);
    } finally {
        await app.destroy();
    }
};

bootstrap().catch(() => {
    process.exit(1);
});
