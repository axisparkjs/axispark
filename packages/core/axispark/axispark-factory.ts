import { Factory } from '@axisparkjs/common';
import { AxisparkContext } from './axispark-context';
import { AxisparkCore } from './axispark-core';

export class AxisparkFactoryStatic implements Factory<AxisparkCore> {
    public create(name = 'App'): AxisparkCore {
        // Perform any necessary setup or configuration here
        const context = new AxisparkContext(name);
        return new AxisparkCore(context);
    }
}

export const AxisparkFactory = new AxisparkFactoryStatic();
