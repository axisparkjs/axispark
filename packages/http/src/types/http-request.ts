export interface HttpRequest {
    method: string;
    path: string;
    url: string;
    headers: Readonly<Record<string, string | string[] | undefined>>;
    query: Readonly<Record<string, string | string[]>>;
    params: Readonly<Record<string, string | string[]>>;
    body: unknown;
    ip: string | undefined;
    cookies: Readonly<Record<string, string | undefined>>;

    getCookie(name: string): string | undefined;
    getHeader(name: string): string | string[] | undefined;
}
