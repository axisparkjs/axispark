import { Controller, Get } from '@axisparkjs/http';
import { Context } from '@axisparkjs/engine';
import { Secured, SecurityContext } from '@axisparkjs/security';
import { Principal } from '../authenticator';
import { AdminPolicy } from '../policies';

@Controller('access')
export class AccessController {
    @Get('public')
    publicRoute() {
        return { access: 'public' };
    }

    @Get('identity')
    identity(@Context() context: SecurityContext<Principal>) {
        return {
            authenticated: context.authenticated === true,
            principal: context.data ?? null
        };
    }

    @Get('required')
    @Secured({ policies: [] })
    authenticatedRoute() {
        return { access: 'authenticated' };
    }

    @Get('admin')
    @Secured({ policies: [AdminPolicy] })
    adminRoute() {
        return { access: 'admin' };
    }
}
