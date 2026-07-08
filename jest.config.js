const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ['node_modules'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {}]
    },
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95
        }
    },
    cache: false,
    detectOpenHandles: true,
    coveragePathIgnorePatterns: ['/node_modules/', '/lib/', '/test/', '/index.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/lib/'],
    moduleNameMapper: {
        '^@axisparkjs/common$': '<rootDir>/packages/common/src',
        '^@axisparkjs/common/(.*)$': '<rootDir>/packages/common/src/$1',
        '^@axisparkjs/core$': '<rootDir>/packages/core/src',
        '^@axisparkjs/core/(.*)$': '<rootDir>/packages/core/src/$1',
        '^@axisparkjs/di$': '<rootDir>/packages/di/src',
        '^@axisparkjs/di/(.*)$': '<rootDir>/packages/di/src/$1',
        '^@axisparkjs/logger$': '<rootDir>/packages/logger/src',
        '^@axisparkjs/logger/(.*)$': '<rootDir>/packages/logger/src/$1'
    },
    setupFiles: ['<rootDir>/jest.setup.ts']
};

module.exports = config;