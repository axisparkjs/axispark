import { Token } from '../token';

export interface ValueProvider<T = unknown> {
    token: Token<T>;
    useValue: T;
}

export interface ClassProvider<T = unknown> {
    token: Token<T>;
    useClass: Token<T>;
}

export interface ExistingProvider<T = unknown> {
    token: Token<T>;
    useExisting: Token<T>;
}

export interface FactoryProvider<T = unknown> {
    token: Token<T>;
    useFactory: (...args: any[]) => T | Promise<T>;
    inject?: Token[];
}

export type Provider<T = unknown> = ValueProvider<T> | ClassProvider<T> | ExistingProvider<T> | FactoryProvider<T>;
