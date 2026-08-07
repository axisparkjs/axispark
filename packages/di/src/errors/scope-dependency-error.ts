export class ScopeDependencyError extends Error {
    constructor(path: string) {
        super(`Scope dependency restriction detected: ${path}. Singleton services cannot depend on scoped or transient services.`);
    }
}
