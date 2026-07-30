import { Metadata, MetadataKey } from '@axisparkjs/common';
import { Constructor } from './types/constructor';

class ClassRegistryStatic {
    private readonly registry = new Map<string, Constructor>();

    register(constructor: Constructor): void {
        this.registry.set(constructor.name, constructor);
    }

    remove(constructor: Constructor): void {
        this.registry.delete(constructor.name);
    }

    get(name: string): Constructor | undefined {
        return this.registry.get(name);
    }

    getAll(): Constructor[] {
        return Array.from(this.registry.values());
    }

    getWithMetadata(metadata: MetadataKey): Constructor[] {
        const classes = this.getAll();
        return classes.filter((cls) => {
            return Metadata.has(metadata, cls);
        });
    }
}

export const ClassRegistry = new ClassRegistryStatic();
