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
    setupFiles: ['<rootDir>/jest.setup.ts']
};
export default config;
