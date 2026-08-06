export class PluginCircularDependencyError extends Error {
    constructor() {
        super('Circular dependency detected among plugins');
        this.name = 'PluginCircularDependencyError';
    }
}
