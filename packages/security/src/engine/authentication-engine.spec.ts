import { ClassRegistry } from '@axisparkjs/di';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { ExecutionTransport } from '@axisparkjs/engine';
import { Authenticator } from '../types/authenticator';
import { AuthenticationEngine } from './authentication-engine';

describe('AuthenticationEngine', () => {
    let injector: { get: jest.Mock };
    let options: any;
    let engine: AuthenticationEngine;
    let registrySpy: jest.SpyInstance;

    beforeEach(() => {
        injector = { get: jest.fn() };
        options = { authenticator: { strategy: 'selected', selected: [] } };
        engine = new AuthenticationEngine(options, injector as any);
        registrySpy = jest.spyOn(ClassRegistry, 'getWithMetadata').mockReturnValue([] as any);
    });

    afterEach(() => {
        registrySpy.mockRestore();
    });

    function context(target: Function, propertyKey = 'run') {
        return {
            target,
            propertyKey,
            transport: ExecutionTransport.Http,
            authenticated: false,
            securedMethod: false
        } as any;
    }

    it('marks a method secured when method metadata exists', async () => {
        class Controller {}
        Metadata.define(MetadataKeys.SECURED, { policies: [] }, Controller, 'run');
        const actual = context(Controller);

        await engine.execute(actual);

        expect(actual.securedMethod).toBe(true);
    });

    it('marks a method secured when class metadata exists', async () => {
        class Controller {}
        Metadata.define(MetadataKeys.SECURED, { policies: [] }, Controller);
        const actual = context(Controller);

        await engine.execute(actual);

        expect(actual.securedMethod).toBe(true);
    });

    it('uses selected authenticators and stores the first truthy result', async () => {
        class First extends Authenticator {
            static readonly transports = [ExecutionTransport.Http];
            authenticate = jest.fn().mockResolvedValue({ id: 7 });
        }
        class Second extends Authenticator {
            static readonly transports = [ExecutionTransport.Http];
            authenticate = jest.fn();
        }
        const first = new First();
        const second = new Second();
        options.authenticator.selected = [First, Second];
        injector.get.mockImplementation(async (target: Function) => (target === First ? first : second));
        const actual = context(class Controller {});

        await engine.execute(actual);

        expect(injector.get).toHaveBeenCalledTimes(1);
        expect(injector.get).toHaveBeenCalledWith(First);
        expect(first.authenticate).toHaveBeenCalledWith(actual);
        expect(second.authenticate).not.toHaveBeenCalled();
        expect(actual).toMatchObject({ authenticated: true, data: { id: 7 }, authenticationMethod: First });
    });

    it('uses registered authenticators when the strategy is all', async () => {
        class NotAnAuthenticator {}
        class Registered extends Authenticator {
            static readonly transports = [ExecutionTransport.Http];
            authenticate = jest.fn().mockResolvedValue('principal');
        }
        const instance = new Registered();
        options.authenticator = undefined;
        registrySpy.mockReturnValue([NotAnAuthenticator, Registered] as any);
        injector.get.mockResolvedValue(instance);
        const actual = context(class Controller {});

        await engine.execute(actual);

        expect(registrySpy).toHaveBeenCalledWith(MetadataKeys.INJECTABLE);
        expect(actual.data).toBe('principal');
    });

    it('uses an empty list when selected strategy has no explicit list', async () => {
        options.authenticator = { strategy: 'selected' };

        await engine.execute(context(class Controller {}));

        expect(injector.get).not.toHaveBeenCalled();
        expect(registrySpy).not.toHaveBeenCalled();
    });

    it('skips authenticators that do not support the current transport', async () => {
        class OtherTransport extends Authenticator {
            static readonly transports = [ExecutionTransport.Other];
            authenticate = jest.fn();
        }
        options.authenticator.selected = [OtherTransport];

        await engine.execute(context(class Controller {}));

        expect(injector.get).not.toHaveBeenCalled();
    });

    it('accepts authenticators configured for all transports', async () => {
        class AnyTransport extends Authenticator {
            static readonly transports = [ExecutionTransport.All];
            authenticate = jest.fn().mockResolvedValue({ subject: 'user' });
        }
        const instance = new AnyTransport();
        options.authenticator.selected = [AnyTransport];
        injector.get.mockResolvedValue(instance);
        const actual = context(class Controller {});

        await engine.execute(actual);

        expect(actual.authenticated).toBe(true);
    });

    it.each([undefined, false, 0, ''])('does not authenticate when the authenticator returns %p', async (result) => {
        class Falsy extends Authenticator {
            static readonly transports = [ExecutionTransport.Http];
            authenticate = jest.fn().mockResolvedValue(result);
        }
        options.authenticator.selected = [Falsy];
        injector.get.mockResolvedValue(new Falsy());
        const actual = context(class Controller {});

        await engine.execute(actual);

        expect(actual.authenticated).toBe(false);
        expect(actual.authenticationMethod).toBeUndefined();
    });
});
