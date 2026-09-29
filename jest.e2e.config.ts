import baseConfig from './jest.config.js';

export const config = {
    ...baseConfig,
    collectCoverage: false,
    coverageThreshold: {},
    testRegex: '.*\\.e2e\\.spec\\.ts$',
    moduleNameMapper: {
        ...Object.fromEntries(
            Object.entries(baseConfig.moduleNameMapper).map(([key, value]) => [key, (value as string).replace('<rootDir>../../', '<rootDir>/')])
        ),
        '^@axisparkjs/samples$': '<rootDir>/samples',
        '^@axisparkjs/samples/(.*)$': '<rootDir>/samples/$1'
    }
};
export default config;
