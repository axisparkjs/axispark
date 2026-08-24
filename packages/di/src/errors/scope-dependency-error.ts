/**
 * Represents an error that occurs when a singleton service depends on a scoped or transient service, which is not allowed in the dependency injection container.
 */
export class ScopeDependencyError extends Error {
    constructor(path: string) {
        super(`Scope dependency restriction detected: ${path}. Singleton services cannot depend on scoped or transient services.`);
    }
}
