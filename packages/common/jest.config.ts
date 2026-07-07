import { config as baseConfig } from '../../jest.config.ts';

export const config = {
    ...baseConfig,
    collectCoverageFrom: ['src/**/*.{ts,js}'],
    setupFiles: ['<rootDir>../../jest.setup.ts']
};
export default config;
