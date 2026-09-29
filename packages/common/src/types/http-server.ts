import * as http from 'node:http';
import * as http2 from 'node:http2';
import * as https from 'node:https';

export type HttpServer = http.Server | https.Server | http2.Http2Server | http2.Http2SecureServer;
