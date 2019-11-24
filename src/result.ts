/** Possible  */
export const enum ResultType {
    Ok,
    Err
}

/** Control flow callback. */
export type ControlFlowFn<T, U = string> = () => Result<T, U>;

/**
 * Alternative error handling heavily based on rusts implementation of `std::result::Result`.
 *
 * The result comes in one of two states, `Ok` representing a successful result containing a value,
 * and `Err` representing an error containing an error value.
 *
 * ```ts
 * function division(val: number, divisor: number): Result<number> {
 *      return divisor !== 0 ? ok(val / divisor) : err('Division by zero');
 * }
 *
 * // Returns "5"
 * const a = division(50, 10).unwrap();
 * // Returns "100"
 * const b = division(50, 0).or(ok(100)).unwrap();
 * ```
 *
 * @see https://doc.rust-lang.org/std/result/index.html
 */
export class Result<OkVal = any, ErrVal = string> {

    constructor(type: ResultType.Ok, val: OkVal);
    constructor(type: ResultType.Err, val: ErrVal);
    constructor(
        protected readonly type: ResultType,
        protected readonly val: any
    )  {}

    /** Returns `true` if the result is "ok". */
    public isOk(): this is { val: OkVal } {
        return this.type === ResultType.Ok;
    }

    /** Returns `true` if the result is an error. */
    public isErr(): this is { val: ErrVal } {
        return this.type === ResultType.Err;
    }

    /**
     * Returns `res` if the result is `ResultType.Ok`.
     *
     * ```ts
     * // Logs "FooBar"
     * console.log(
     *      ok(null).and(ok('FooBar')).unwrap()
     * );
     * ```
     */
    public and<T = OkVal>(this: Result<T>, res: Result<T>): Result<T> {
        return this.isOk() ? res : this;
    }

    /**
     * Calls `fn` if the result is "Ok".
     *
     * ```ts
     * const res = ok(null).andThen(() => ok('FooBar'));
     *
     * // Logs "FooBar"
     * console.log(res.unwrap());
     * ```
     */
    public andThen<T>(this: Result<T>, cb: ControlFlowFn<T>): Result<T> {
        return this.isOk() ? cb() : this;
    }

    /**
     * Returns `res` if the result is `ResultType.Err`
     *
     * ```ts
     * const a = err('foo');
     * const b = ok('bar');
     *
     * // This will print "bar".
     * console.log(a.or(b).unwrap());
     * ```
     */
    public or<T>(this: Result<T>, res: Result<T>): Result<T> {
        return this.isOk() ? this : res;
    }

    /**
     * Calls `fn` if the result is an "Err".
     *
     * ```ts
     * // Replace the faulty result with a new one that is "Ok"
     * const res = err(null).orElse(() => ok('FooBar')).unwrap();
     *
     * // Logs "FooBar"
     * console.log(res.unwrap());
     * ```
     */
    public orElse<T>(this: Result<T>, fn: ControlFlowFn<T>): Result<T> {
        return this.isErr() ? fn() : this;
    }

    /**
     * Returns the result value if the result is `Ok`. Throws an error containing
     * the results value otherwise.
     *
     * ```ts
     * const a = ok('foo');
     * const b = err('bar');
     *
     * // Logs "foo"
     * console.log(a.unwrap());
     * // Throws an error with the message "bar"
     * b.unwrap();
     * ```
     */
    public unwrap(): OkVal {
        if (this.isErr()) {
            throw new Error(this.val.toString());
        }

        return this.val;
    }

    /**
     * Returns the result value if the result is `Ok`. Returns `val` if the
     * result is an `Err`.
     *
     * @param val Fallback value that should be returned if result is `Err`.
     * @returns Result value or fallback value
     */
    public unwrapOr(val: OkVal): OkVal {
        return this.isErr() ? val : this.val;
    }

    /**
     * Returns the result value if the result is an error. Throws with the "Ok"
     * value otherwise.
     *
     * @see unwrap()
     */
    public unwrapErr(): OkVal {
        if (this.isOk()) {
            throw new Error(this.val.toString());
        }

        return this.val;
    }

    /**
     * Returns the result value if the result is `ResultType.Ok`. Throws with the given message if
     * the result is `ResultType.Err`
     *
     * ```ts
     * // Log "Foo" to the console.
     * console.log(ok('Foo').expect('Oops'));
     *
     * // This will throw with the message "Oops".
     * err(null).expect('Oops');
     * ```
     */
    public expect(msg: string): this {
        if (this.isErr()) {
            throw new Error(msg);
        }

        return this.val;
    }

    /**
     * Returns `true` if the result is `Ok` and matches the given value.
     *
     * ```ts
     * const a = ok('Foo');
     * const b = err('Bar');
     *
     * console.log(a.contains('Foo')); // true
     * console.log(a.contains('Bar')); // false
     * console.log(b.contains('Bar')); // false
     * ```
     *
     * @param val The value that the `Ok` value of the result must match.
     * @returns A boolean indicating if values matched.
     */
    public contains(val: OkVal): boolean {
        return this.isOk() && this.val === val;
    }

    /**
     * Returns `true` if the result is `Err` and matches the given value.
     *
     * @param val The value that the `Err` value of the result must match.
     * @returns A boolean indicating if values matched.
     */
    public containsErr(val: ErrVal): boolean {
        return this.isErr() && this.val === val;
    }

}
