import { Container, ScopedContainer } from '../container';
import { Injectable } from '../decorators';

@Injectable()
export class ScopedContainerManager {
    constructor(private readonly container: Container) {}

    public create(): ScopedContainer {
        return this.container.createScopedContainer();
    }
}
