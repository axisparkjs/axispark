import { Metadata, MetadataKey, ClassType } from '@axisparkjs/common';

class ClassRegistryStatic {
    private readonly registry = new Map<string, ClassType>();

    register(constructor: ClassType): void {
        this.registry.set(constructor.name, constructor);
    }

    remove(constructor: ClassType): void {
        this.registry.delete(constructor.name);
    }

    get(name: string): ClassType | undefined {
        return this.registry.get(name);
    }

    getAll(): ClassType[] {
        return Array.from(this.registry.values());
    }

    getWithMetadata(metadata: MetadataKey): ClassType[] {
        const classes = this.getAll();
        return classes.filter((cls) => {
            return Metadata.has(metadata, cls);
        });
    }
}

export const ClassRegistry = new ClassRegistryStatic();
