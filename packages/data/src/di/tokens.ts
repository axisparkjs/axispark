import { ClassType } from '@axisparkjs/common';
import { Inject, InjectionToken } from '@axisparkjs/di';

/** Injection token for the Data options. */
export const DATA_OPTIONS = new InjectionToken('DATA_OPTIONS');
/** Injection token for the Data logger. */
export const DATA_LOGGER = new InjectionToken('DATA_LOGGER');

/** Inject decorator for a specific Data repository. */
export const InjectRepository = (repository: ClassType) => Inject(new InjectionToken(`DATA_REPOSITORY_${repository.name.toLocaleUpperCase()}`));
/** Inject decorator for a specific Data Source. */
export const InjectDataSource = (name: string) => Inject(new InjectionToken(`DATA_SOURCE_${name.toLocaleUpperCase()}`));
