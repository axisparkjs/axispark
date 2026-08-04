import { Body, Controller, Delete, Get, HttpRequest, HttpResponse, HttpSession, Param, Post, Request, Response, Session } from '@axisparkjs/http';

@Controller('sessions')
export class SessionController {
    constructor() {}

    @Get()
    getSessionId(@Session() session: HttpSession) {
        return session.id;
    }

    @Get('data')
    getSessionData(@Session() session: HttpSession) {
        return session.data['data'] || undefined;
    }

    @Post('data')
    setSessionData(@Session() session: HttpSession, @Body() data: any) {
        session.set('data', data);
        return session.data['data'];
    }

    @Delete('data')
    deleteSessionData(@Session() session: HttpSession) {
        session.delete('data');
    }
}

@Controller('cookies')
export class CookieController {
    constructor() {}

    @Get()
    getCookies(@Request() request: HttpRequest) {
        return request.cookies;
    }

    @Post()
    setCookie(@Response() response: HttpResponse, @Body() body: any) {
        const { name, value, options } = body;
        response.cookie(name, value, options);
    }

    @Delete(':name')
    deleteCookie(@Response() response: HttpResponse, @Param('name') name: string) {
        response.clearCookie(name);
    }
}
