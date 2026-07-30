export interface HttpResponse {
    status(code: number): this;
    header(name: string, value: string): this;
    json(body?: any): void;
    send(body?: any): void;
    file(filePath: string): void;
    stream(stream: NodeJS.ReadableStream): void;
    end(): void;
    isCommitted(): boolean;
}
