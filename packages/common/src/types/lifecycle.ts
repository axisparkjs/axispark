import { Destroyable } from './destroyable';
import { Initializable } from './initializable';
import { Runnable } from './runnable';

/**
 * An interface representing a lifecycle object that can be initialized, destroyed, and run.
 */
export interface Lifecycle extends Initializable, Destroyable, Runnable {}
