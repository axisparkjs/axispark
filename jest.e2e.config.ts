import baseConfig from './jest.config.js';

export const config = {
    ...baseConfig,
    collectCoverage: false,
    coverageThreshold: {},
    testRegex: '.*\\.e2e\\.spec\\.ts$',
    moduleNameMapper: {
        ...baseConfig.moduleNameMapper,
        '^@axisparkjs/samples$': '<rootDir>/samples',
        '^@axisparkjs/samples/(.*)$': '<rootDir>/samples/$1'
    }
};
export default config;
