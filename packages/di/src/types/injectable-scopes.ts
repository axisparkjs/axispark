/**
 * An enumeration representing the different scopes of injectable dependencies.
 * The scopes define the lifecycle and sharing behavior of instances created by the dependency injection system.
 */
export enum InjectableScopes {
    Singleton = 'singleton',
    Scoped = 'scoped',
    Transient = 'transient'
}
