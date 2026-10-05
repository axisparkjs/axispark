import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { InjectDataSource, InjectRepository, DATA_LOGGER, DATA_OPTIONS } from './tokens';

describe('data dependency injection tokens', () => {
    class UserRepository {}
    class Consumer {}

    it('exports stable options and logger tokens', () => {
        expect(DATA_OPTIONS.description).toBe('DATA_OPTIONS');
        expect(DATA_LOGGER.description).toBe('DATA_LOGGER');
    });

    it('creates a repository injection decorator using the repository class name', () => {
        InjectRepository(UserRepository)(Consumer, undefined, 0);

        const metadata = Metadata.get<{ params: Map<number, { description: string }> }>(MetadataKeys.INJECT, Consumer);
        expect(metadata?.params.get(0)?.description).toBe('DATA_REPOSITORY_USERREPOSITORY');
    });

    it('creates a data source injection decorator using the uppercase source name', () => {
        InjectDataSource('primary')(Consumer, undefined, 1);

        const metadata = Metadata.get<{ params: Map<number, { description: string }> }>(MetadataKeys.INJECT, Consumer);
        expect(metadata?.params.get(1)?.description).toBe('DATA_SOURCE_PRIMARY');
    });
});
