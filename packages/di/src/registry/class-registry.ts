import { Metadata, MetadataKey, ClassType } from '@axisparkjs/common';

/**
 * A static class for managing the registration and retrieval of classes.
 */
export class ClassRegistryStatic {
    private readonly registry = new Map<string, ClassType>();

    /**
     * Registers a class in the registry.
     * @param constructor The class constructor to register.
     */
    register(constructor: ClassType): void {
        this.registry.set(constructor.name, constructor);
    }

    /**
     * Removes a class from the registry.
     * @param constructor The class constructor to remove.
     */
    remove(constructor: ClassType): void {
        this.registry.delete(constructor.name);
    }

    /**
     * Retrieves a class from the registry by its name.
     * @param name The name of the class to retrieve.
     * @returns The class constructor if found, otherwise undefined.
     */
    get(name: string): ClassType | undefined {
        return this.registry.get(name);
    }

    /**
     * Retrieves all registered classes from the registry.
     * @returns An array of all registered class constructors.
     */
    getAll(): ClassType[] {
        return Array.from(this.registry.values());
    }

    /**
     * Retrieves all registered classes that have the specified metadata.
     * @param metadata The metadata to filter by.
     * @returns An array of class constructors that have the specified metadata.
     */
    getWithMetadata(metadata: MetadataKey): ClassType[] {
        const classes = this.getAll();
        return classes.filter((cls) => {
            return Metadata.has(metadata, cls);
        });
    }
}

/**
 * An class registry that can be used to register and retrieve classes. It provides methods for registering, removing, and retrieving classes by name or metadata. This registry is useful for managing class dependencies and facilitating dependency injection in applications.
 */
export const ClassRegistry = new ClassRegistryStatic();
