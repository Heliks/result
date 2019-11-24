import { Result, ResultType } from './result';

export function ok<T>(value: T): Result<T> {
    return new Result<T>(ResultType.Ok, value);
}

export function err<T>(value: T): Result<unknown, T> {
    return new Result<unknown, T>(ResultType.Err, value);
}
