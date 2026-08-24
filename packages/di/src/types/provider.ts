import { ClassType } from '@axisparkjs/common';
import { InjectableScopes } from '../types';
import { Token } from '../token';

/**
 * A base interface for providers in the dependency injection system. It defines a common structure for all provider types, including a token that identifies the dependency being provided.
 */
interface BaseProvider<T = unknown> {
    token: Token<T>;
}

/**
 * An interface for value providers in the dependency injection system. It extends the base provider interface and adds a property for the value to be injected.
 */
export interface ValueProvider<T = unknown> extends BaseProvider<T> {
    useValue: T;
}

/**
 * An interface for class providers in the dependency injection system. It extends the base provider interface and adds a property for the class to be instantiated.
 */
export interface ClassProvider<T = unknown> extends BaseProvider<T> {
    useClass: ClassType<T>;
    scope: InjectableScopes;
}

/**
 * An interface for existing providers in the dependency injection system. It extends the base provider interface and adds a property for the existing token to be injected.
 */
export interface ExistingProvider<T = unknown> extends BaseProvider<T> {
    useExisting: Token<T>;
}

/**
 * An interface for factory providers in the dependency injection system. It extends the base provider interface and adds a property for the factory function to be used.
 */
export interface FactoryProvider<T = unknown> extends BaseProvider<T> {
    useFactory: (...args: any[]) => T | Promise<T>;
    forClass: ClassType<T>;
    inject?: Token[];
    scope: InjectableScopes;
}

/**
 * A type representing any of the provider types in the dependency injection system.
 */
export type Provider<T = unknown> = ValueProvider<T> | ClassProvider<T> | ExistingProvider<T> | FactoryProvider<T>;
