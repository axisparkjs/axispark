import baseConfig from '../../jest.config.js';

export const config = {
    ...baseConfig,
    collectCoverageFrom: ['src/**/*.{ts,js}'],
    setupFiles: ['<rootDir>../../jest.setup.ts'],
    moduleNameMapper: {
        '^@axisparkjs/common$': '<rootDir>../../packages/common/src',
        '^@axisparkjs/common/(.*)$': '<rootDir>../../packages/common/src/$1'
    }
};
export default config;
