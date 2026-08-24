/**
 * Represents an HTTP session, providing methods to manage session data, including getting, setting, checking, deleting, and clearing session values. Also includes methods to save, reload, regenerate, destroy, and touch the session.
 */
export interface HttpSession<T extends object = Record<string, unknown>> {
    readonly id: string;
    readonly data: Readonly<T>;

    get<K extends keyof T>(key: K): T[K] | undefined;
    set<K extends keyof T>(key: K, value: T[K]): void;

    has<K extends keyof T>(key: K): boolean;
    delete<K extends keyof T>(key: K): boolean;

    clear(): void;

    save(): Promise<void>;
    reload(): Promise<void>;
    regenerate(): Promise<void>;
    destroy(): Promise<void>;
    touch(): Promise<void>;
}
