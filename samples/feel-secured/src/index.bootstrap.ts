import { expressApp } from './app';

const bootstrap = async () => {
    try {
        await expressApp.init();
        await expressApp.run();
    } finally {
        await expressApp.destroy();
    }
};

bootstrap().catch(() => {
    process.exit(1);
});
