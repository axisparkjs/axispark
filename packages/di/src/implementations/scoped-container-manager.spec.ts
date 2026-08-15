import { Container, ScopedContainer } from '../container';
import { ScopedContainerManager } from './scoped-container-manager';

describe('ScopedContainerManager', () => {
    let container: {
        createScopedContainer: jest.Mock;
    };

    let manager: ScopedContainerManager;

    beforeEach(() => {
        container = {
            createScopedContainer: jest.fn()
        };

        manager = new ScopedContainerManager(
            container as unknown as Container
        );
    });

    describe('create', () => {
        it('should create a scoped container using the container', () => {
            const scopedContainer = {} as ScopedContainer;

            container.createScopedContainer.mockReturnValue(
                scopedContainer
            );

            const result = manager.create();

            expect(container.createScopedContainer)
                .toHaveBeenCalledTimes(1);

            expect(result).toBe(scopedContainer);
        });

        it('should return the scoped container created by the container', () => {
            const scopedContainer = {
                resolve: jest.fn()
            } as unknown as ScopedContainer;

            container.createScopedContainer.mockReturnValue(
                scopedContainer
            );

            expect(manager.create()).toBe(scopedContainer);
        });
    });
});