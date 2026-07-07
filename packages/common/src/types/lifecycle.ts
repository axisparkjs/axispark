import { Destroyable } from './destroyable';
import { Initializable } from './initializable';
import { Runnable } from './runnable';

export interface Lifecycle extends Initializable, Destroyable, Runnable {}
