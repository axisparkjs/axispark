export class CircularDependencyError extends Error {
    constructor(path: string) {
        super(`Circular dependency detected: ${path}`);
    }
}
