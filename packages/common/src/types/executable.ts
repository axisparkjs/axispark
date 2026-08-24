/**
+ * An interface representing an executable object. It defines an `execute` method that can be called to perform some action or operation. The `execute` method can accept any number of arguments of unknown types and can return any type of value.
+ */
export interface Executable {
    execute(...args: unknown[]): any;
}
