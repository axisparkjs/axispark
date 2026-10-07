import { Controller, Get, Path } from '@axisparkjs/http';
import { Context } from '@axisparkjs/engine';
import { Secured, SecurityContext } from '@axisparkjs/security';
import { Principal } from '../authenticator';
import { ActivePrincipalPolicy, DocumentOwnerPolicy } from '../policies';

@Controller('documents')
@Secured({ policies: [ActivePrincipalPolicy] })
export class DocumentController {
    @Get(':ownerId')
    @Secured({ policies: [DocumentOwnerPolicy] })
    getDocument(@Path('ownerId') ownerId: string, @Context() context: SecurityContext<Principal>) {
        return { ownerId, principal: context.data?.id };
    }
}
