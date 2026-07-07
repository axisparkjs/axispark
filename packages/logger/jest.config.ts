import { config as baseConfig } from '../../jest.config.ts';

export const config = {
    ...baseConfig,
    collectCoverageFrom: ['src/**/*.{ts,js}'],
    setupFiles: ['<rootDir>../../jest.setup.ts'],
    moduleNameMapper: {
        '^@axisparkjs/common$': '<rootDir>../../packages/common/src',
        '^@axisparkjs/common/(.*)$': '<rootDir>../../packages/common/src/$1',
        '^@axisparkjs/di$': '<rootDir>../../packages/di/src',
        '^@axisparkjs/di/(.*)$': '<rootDir>../../packages/di/src/$1'
    }
};
export default config;
