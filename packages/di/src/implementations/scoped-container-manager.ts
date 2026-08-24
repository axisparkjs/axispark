import { Container, ScopedContainer } from '../container';
import { Injectable } from '../decorators';

/**
 * A class that manages the creation of scoped containers.
 */
@Injectable()
export class ScopedContainerManager {
    constructor(private readonly container: Container) {}

    /**
     * Creates a new scoped container.
     * @returns A new instance of ScopedContainer.
     */
    public create(): ScopedContainer {
        return this.container.createScopedContainer();
    }
}
