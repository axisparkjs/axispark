import { Constructor } from './types';
import { Container } from './container';
import { Token } from './token';
import { Injectable } from './decorators';

@Injectable()
export class Injector {
    constructor(private readonly container: Container) {}

    public get<T>(token: Token<T>): T {
        return this.container.resolve<T>(token);
    }

    public instantiate<T>(token: Constructor<T>): T {
        this.container.bind(token);
        const instance = this.container.resolve(token);
        this.container.unbind(token);
        return instance;
    }
}
