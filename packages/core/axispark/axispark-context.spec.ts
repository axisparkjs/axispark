import { Logger } from '@axispark/logger';
import { Container } from '@axispark/di';
import { AxisparkContext } from './axispark-context';
import { PluginRegistry } from '../plugins';

describe('AxisparkContext', () => {
    let context: AxisparkContext;

    beforeEach(() => {
        context = new AxisparkContext('my-app');
    });

    describe('constructor', () => {
        it('should create a logger', () => {
            expect(context.logger).toBeInstanceOf(Logger);
        });

        it('should create a plugin registry', () => {
            expect(context.plugins).toBeInstanceOf(PluginRegistry);
        });

        it('should create a DI container', () => {
            expect(context.container).toBeInstanceOf(Container);
        });
    });
});
