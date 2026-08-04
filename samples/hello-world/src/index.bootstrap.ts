import { app } from './app';

const bootstrap = async () => {
    try {
        await app.init();
        await app.run();
    } catch (e) {
        console.error('Error during bootstrap:', e);
    } finally {
        await app.destroy();
    }
};

bootstrap().catch((e) => {
    console.error('Error during bootstrap:', e);
    process.exit(1);
});
