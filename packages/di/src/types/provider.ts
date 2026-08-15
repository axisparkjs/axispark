import { ClassType } from '@axisparkjs/common';
import { InjectableScopes } from '../types';
import { Token } from '../token';

interface BaseProvider<T = unknown> {
    token: Token<T>;
}

export interface ValueProvider<T = unknown> extends BaseProvider<T> {
    useValue: T;
}

export interface ClassProvider<T = unknown> extends BaseProvider<T> {
    useClass: ClassType<T>;
    scope: InjectableScopes;
}

export interface ExistingProvider<T = unknown> extends BaseProvider<T> {
    useExisting: Token<T>;
}

export interface FactoryProvider<T = unknown> extends BaseProvider<T> {
    useFactory: (...args: any[]) => T | Promise<T>;
    forClass: ClassType<T>;
    inject?: Token[];
    scope: InjectableScopes;
}

export type Provider<T = unknown> = ValueProvider<T> | ClassProvider<T> | ExistingProvider<T> | FactoryProvider<T>;
