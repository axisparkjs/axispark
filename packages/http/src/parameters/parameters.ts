import { Parameter } from '@axisparkjs/engine';
import { HttpParameter } from '../types/http-parameter';

export const Request = Parameter(HttpParameter.Request);
export const Response = Parameter(HttpParameter.Response);
export const Body = Parameter(HttpParameter.Body);
export const Param = Parameter(HttpParameter.Param);
export const Query = Parameter(HttpParameter.Query);
export const Header = Parameter(HttpParameter.Header);
export const Ip = Parameter(HttpParameter.Ip);
export const Session = Parameter(HttpParameter.Session);
export const Cookie = Parameter(HttpParameter.Cookie);
