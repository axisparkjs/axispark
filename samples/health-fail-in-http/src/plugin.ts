import { Plugin } from '@axisparkjs/core';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class BadPlugin extends Plugin {
    onStart() {
        throw new Error('BadPlugin forces a failure on start');
    }
}
