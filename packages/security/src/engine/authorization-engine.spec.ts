import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { AuthorizationPolicy } from '../types/authorization-policy';
import { AuthorizationEngine } from './authorization-engine';

describe('AuthorizationEngine', () => {
    let injector: { get: jest.Mock };
    let engine: AuthorizationEngine;

    beforeEach(() => {
        injector = { get: jest.fn() };
        engine = new AuthorizationEngine(injector as any);
    });

    function context(target: Function, propertyKey = 'run') {
        return { target, propertyKey, transport: 'http' } as any;
    }

    it('allows a secured target with no policies', async () => {
        const actual = context(class Controller {});

        await engine.execute(actual);

        expect(actual.authorized).toBe(true);
        expect(actual.authorizationDecisions).toEqual([]);
        expect(injector.get).not.toHaveBeenCalled();
    });

    it('evaluates method policies and records their decisions', async () => {
        class Controller {}
        class Policy extends AuthorizationPolicy {
            authorize = jest.fn(async () => ({ policy: Policy, authorized: true as const }));
        }
        const policy = new Policy();
        Metadata.define(MetadataKeys.SECURED, { policies: [Policy] }, Controller, 'run');
        injector.get.mockResolvedValue(policy);
        const actual = context(Controller);

        await engine.execute(actual);

        expect(injector.get).toHaveBeenCalledWith(Policy);
        expect(policy.authorize).toHaveBeenCalledWith(actual);
        expect(actual.authorized).toBe(true);
        expect(actual.authorizationDecisions).toEqual([{ policy: Policy, authorized: true }]);
    });

    it('combines class and method policies and denies if any policy denies', async () => {
        class Controller {}
        class ClassPolicy extends AuthorizationPolicy {
            authorize = jest.fn(async () => ({ policy: ClassPolicy, authorized: true as const }));
        }
        class MethodPolicy extends AuthorizationPolicy {
            authorize = jest.fn(async () => ({ policy: MethodPolicy, authorized: false as const, reason: 'not owner' }));
        }
        const classPolicy = new ClassPolicy();
        const methodPolicy = new MethodPolicy();
        Metadata.define(MetadataKeys.SECURED, { policies: [ClassPolicy] }, Controller);
        Metadata.define(MetadataKeys.SECURED, { policies: [MethodPolicy] }, Controller, 'run');
        injector.get.mockImplementation(async (target: Function) => (target === ClassPolicy ? classPolicy : methodPolicy));
        const actual = context(Controller);

        await engine.execute(actual);

        expect(injector.get).toHaveBeenNthCalledWith(1, ClassPolicy);
        expect(injector.get).toHaveBeenNthCalledWith(2, MethodPolicy);
        expect(actual.authorized).toBe(false);
        expect(actual.authorizationDecisions).toEqual([
            { policy: ClassPolicy, authorized: true },
            { policy: MethodPolicy, authorized: false, reason: 'not owner' }
        ]);
    });

    it('fails immediately if a policy throws', async () => {
        class Controller {}
        class BrokenPolicy extends AuthorizationPolicy {
            authorize = jest.fn(async () => {
                throw new Error('policy failure');
            });
        }
        Metadata.define(MetadataKeys.SECURED, { policies: [BrokenPolicy] }, Controller, 'run');
        injector.get.mockResolvedValue(new BrokenPolicy());

        await expect(engine.execute(context(Controller))).rejects.toThrow('policy failure');
    });
});
