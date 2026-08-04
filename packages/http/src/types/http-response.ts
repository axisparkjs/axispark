export interface HttpResponse {
    status(code: number): this;
    header(name: string, value: string): this;
    cookie(name: string, value: string, options?: { maxAge?: number; path?: string; domain?: string; secure?: boolean; httpOnly?: boolean; sameSite?: boolean | 'lax' | 'strict' | 'none' }): this;
    clearCookie(name: string, options?: { path?: string; domain?: string; secure?: boolean; httpOnly?: boolean; sameSite?: boolean | 'lax' | 'strict' | 'none' }): this;
    json(body?: any): void;
    send(body?: any): void;
    file(filePath: string): void;
    stream(stream: NodeJS.ReadableStream): void;
    end(): void;
    isCommitted(): boolean;
}
