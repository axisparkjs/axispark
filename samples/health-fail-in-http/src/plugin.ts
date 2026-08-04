import { Pluggable, Plugin } from '@axisparkjs/core';

@Plugin()
export class BadPlugin extends Pluggable {
    onStart() {
        throw new Error('BadPlugin forces a failure on start');
    }
}
