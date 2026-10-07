import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { AuthorizationPolicy } from '../types/authorization-policy';
import { Secured } from './secured';

class AllowPolicy extends AuthorizationPolicy {
    async authorize() {
        return { policy: AllowPolicy, authorized: true } as const;
    }
}

describe('Secured', () => {
    it('stores policies as class metadata', () => {
        class Controller {}
        const policies = [AllowPolicy];

        (Secured({ policies }) as ClassDecorator)(Controller);

        expect(Metadata.get(MetadataKeys.SECURED, Controller)).toEqual({ target: Controller, propertyKey: undefined, policies });
    });

    it('stores policies as method metadata', () => {
        class Controller {
            action() {}
        }
        const policies = [AllowPolicy];
        const descriptor = Object.getOwnPropertyDescriptor(Controller.prototype, 'action') as PropertyDescriptor;

        (Secured({ policies }) as MethodDecorator)(Controller.prototype, 'action', descriptor);

        expect(Metadata.get(MetadataKeys.SECURED, Controller, 'action')).toEqual({
            target: Controller,
            propertyKey: 'action',
            policies
        });
    });
});
