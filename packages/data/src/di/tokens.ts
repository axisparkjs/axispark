import { ClassType } from '@axisparkjs/common';
import { Inject, InjectionToken } from '@axisparkjs/di';

/** Injection token for the Data options. */
export const DATA_OPTIONS = new InjectionToken('DATA_OPTIONS');
/** Injection token for the Data logger. */
export const DATA_LOGGER = new InjectionToken('DATA_LOGGER');

/**
 * Injects a generated repository by its decorated repository class.
 *
 * @example `constructor(@InjectRepository(UserRepository) users: UserRepository) {}`
 */
export const InjectRepository = (repository: ClassType) => Inject(new InjectionToken(`DATA_REPOSITORY_${repository.name.toLocaleUpperCase()}`));
/**
 * Injects a TypeORM data source by its configured name (case-insensitive for token lookup).
 *
 * @example `constructor(@InjectDataSource('PRIMARY') dataSource: DataSource) {}`
 */
export const InjectDataSource = (name: string) => Inject(new InjectionToken(`DATA_SOURCE_${name.toLocaleUpperCase()}`));
