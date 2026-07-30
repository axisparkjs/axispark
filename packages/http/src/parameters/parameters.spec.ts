import { Body, Header, Ip, Param, Query, Request, Response, Session } from './parameters';

it.each([Body, Header, Ip, Param, Query, Request, Response, Session])('Parameter %p should be defined', (parameter) => {
    expect(parameter).toBeDefined();
    expect(parameter).toBeInstanceOf(Function);
});
