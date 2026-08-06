import baseConfig from './jest.config.js';

export const config = {
    ...baseConfig,
    collectCoverage: false,
    coverageThreshold: {},
    testRegex: '.*\\.e2e\\.spec\\.ts$',
    moduleNameMapper: {
        '^@axisparkjs/common$': '<rootDir>/packages/common/src',
        '^@axisparkjs/common/(.*)$': '<rootDir>/packages/common/src/$1',
        '^@axisparkjs/core$': '<rootDir>/packages/core/src',
        '^@axisparkjs/core/(.*)$': '<rootDir>/packages/core/src/$1',
        '^@axisparkjs/di$': '<rootDir>/packages/di/src',
        '^@axisparkjs/di/(.*)$': '<rootDir>/packages/di/src/$1',
        '^@axisparkjs/engine$': '<rootDir>/packages/engine/src',
        '^@axisparkjs/engine/(.*)$': '<rootDir>/packages/engine/src/$1',
        '^@axisparkjs/http$': '<rootDir>/packages/http/src',
        '^@axisparkjs/http/(.*)$': '<rootDir>/packages/http/src/$1',
        '^@axisparkjs/http-express$': '<rootDir>/packages/http-express/src',
        '^@axisparkjs/http-express/(.*)$': '<rootDir>/packages/http-express/src/$1',
        '^@axisparkjs/logger$': '<rootDir>/packages/logger/src',
        '^@axisparkjs/logger/(.*)$': '<rootDir>/packages/logger/src/$1',
        '^@axisparkjs/openapi$': '<rootDir>/packages/openapi/src',
        '^@axisparkjs/openapi/(.*)$': '<rootDir>/packages/openapi/src/$1',
        '^@axisparkjs/test$': '<rootDir>/packages/test/src',
        '^@axisparkjs/test/(.*)$': '<rootDir>/packages/test/src/$1',
        '^@axisparkjs/schedule$': '<rootDir>/packages/schedule/src',
        '^@axisparkjs/schedule/(.*)$': '<rootDir>/packages/schedule/src/$1',
        '^@axisparkjs/samples$': '<rootDir>/samples',
        '^@axisparkjs/samples/(.*)$': '<rootDir>/samples/$1'
    }
};
export default config;
