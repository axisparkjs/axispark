import { Body, Header, Ip, Param, Query, Request, Response, Session, Cookie } from './parameters';

it.each([Body, Header, Ip, Param, Query, Request, Response, Session, Cookie])('Parameter %p should be defined', (parameter) => {
    expect(parameter).toBeDefined();
    expect(parameter).toBeInstanceOf(Function);
});
