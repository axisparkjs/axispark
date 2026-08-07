import { Injectable, InjectionToken } from '@axisparkjs/di';
import { InjectableToken } from '@axisparkjs/di';

@Injectable()
export class Dependecy1 {}

@Injectable()
export class Dependecy2 {
    constructor(public readonly dep1: Dependecy1) {}
}

export const DEPENDENCY_3_TOKEN = new InjectionToken('DEPENDENCY_3_TOKEN');

export interface Dependecy3 {}

@InjectableToken(DEPENDENCY_3_TOKEN)
@Injectable()
export class Dependecy3Impl implements Dependecy3 {}
