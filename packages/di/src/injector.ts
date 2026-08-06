import { Container } from './container';
import { Token } from './token';
import { Injectable } from './decorators';

@Injectable()
export class Injector {
    constructor(private readonly container: Container) {}

    public get<T>(token: Token<T>): T {
        return this.container.resolve<T>(token);
    }
}
