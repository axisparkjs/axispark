export type ErrorClass<T extends Error = Error> = new (...args: any[]) => T;
