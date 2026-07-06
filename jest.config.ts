export const config = {
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
    coveragePathIgnorePatterns: ['/node_modules/', '/lib/', '/test/'],
    testPathIgnorePatterns: ['/node_modules/', '/lib/'],
    moduleNameMapper: {
        '^@axispark/common$': '<rootDir>/packages/common',
        '^@axispark/common/(.*)$': '<rootDir>/packages/common/$1',
        '^@axispark/core$': '<rootDir>/packages/core',
        '^@axispark/core/(.*)$': '<rootDir>/packages/core/$1',
        '^@axispark/di$': '<rootDir>/packages/di',
        '^@axispark/di/(.*)$': '<rootDir>/packages/di/$1',
        '^@axispark/logger$': '<rootDir>/packages/logger',
        '^@axispark/logger/(.*)$': '<rootDir>/packages/logger/$1',
        '^@axispark/http$': '<rootDir>/packages/http',
        '^@axispark/http/(.*)$': '<rootDir>/packages/http/$1',
        '^@axispark/http-express$': '<rootDir>/packages/http-express',
        '^@axispark/http-express/(.*)$': '<rootDir>/packages/http-express/$1'
    },
    setupFiles: ['<rootDir>/jest.setup.ts']
};
export default config;
