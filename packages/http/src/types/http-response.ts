export interface HttpResponse {
    status(code: number): this;
    header(name: string, value: string): this;
    json(body: unknown): void;
    send(body: unknown): void;
    end(): void;
    isCommitted(): boolean;
}
