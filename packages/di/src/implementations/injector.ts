import { Container, ScopedContainer } from '../container';
import { Token } from '../token';
import { Injectable } from '../decorators';

@Injectable()
export class Injector {
    constructor(private readonly container: Container) {}

    public async get<T>(token: Token<T>, scopedContainer?: ScopedContainer): Promise<T> {
        return await this.container.resolve<T>(token, scopedContainer);
    }
}
