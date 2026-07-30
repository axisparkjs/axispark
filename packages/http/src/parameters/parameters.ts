import { Parameter } from '@axisparkjs/engine';
import { HttpParameter } from '../types/http-parameter';

export const Request = Parameter(HttpParameter.REQUEST);
export const Response = Parameter(HttpParameter.RESPONSE);
export const Body = Parameter(HttpParameter.BODY);
export const Param = Parameter(HttpParameter.PARAM);
export const Query = Parameter(HttpParameter.QUERY);
export const Header = Parameter(HttpParameter.HEADER);
export const Ip = Parameter(HttpParameter.IP);
export const Session = Parameter(HttpParameter.SESSION);
