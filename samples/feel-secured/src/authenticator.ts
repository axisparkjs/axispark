import { Injectable } from '@axisparkjs/di';
import { ExecutionContext } from '@axisparkjs/engine';
import { HttpContext } from '@axisparkjs/http';
import { Authenticator } from '@axisparkjs/security';

export interface Principal {
    id: string;
    role: 'reader' | 'admin';
    active: boolean;
}

const principals: Record<string, Principal> = {
    'alice-token': { id: 'alice', role: 'reader', active: true },
    'admin-token': { id: 'admin', role: 'admin', active: true },
    'disabled-token': { id: 'disabled', role: 'reader', active: false }
};

@Injectable()
export class BearerAuthenticator extends Authenticator {
    async authenticate(executionContext: ExecutionContext): Promise<Principal | undefined> {
        const context = executionContext as HttpContext;
        const authorization = context.request.getHeader('authorization');
        if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) return undefined;

        return principals[authorization.slice('Bearer '.length)];
    }
}
