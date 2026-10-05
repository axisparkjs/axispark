import { Metadata } from '@axisparkjs/common';
import { RepositoryMetadata } from '../metadata/repository-metadata';
import { MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';

export function Repository(data: Omit<RepositoryMetadata, 'target'>): ClassDecorator {
    return (target) => {
        const metadata: RepositoryMetadata = {
            target: Metadata.normalizeTarget(target),
            ...data
        };
        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.REPOSITORY, metadata, target);
    };
}
