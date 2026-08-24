/**
 * Represents an error that occurs when a circular dependency is detected in the dependency injection container.
 * This error is thrown when a class or factory provider depends on itself, either directly or indirectly, creating a cycle in the dependency graph.
 * The error message includes the path of the circular dependency for easier debugging.
 */
export class CircularDependencyError extends Error {
    constructor(path: string) {
        super(`Circular dependency detected: ${path}`);
    }
}
