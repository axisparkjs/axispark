import { Container } from './container';
import { Token } from './token';
import { Injectable } from './decorators';
import { ScopedContainer } from './scoped-container';

@Injectable()
export class Injector {
    constructor(private readonly container: Container) {}

    public async get<T>(token: Token<T>, scopedContainer?: ScopedContainer): Promise<T> {
        return await this.container.resolve<T>(token, scopedContainer);
    }
}
