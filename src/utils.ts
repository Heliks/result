import { Result, ResultType } from './result';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ok<T, R = any>(value: T): Result<T, R> {
  return new Result<T, R>(ResultType.Ok, value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function err<T, R = any>(value: T): Result<R, T> {
  return new Result<R, T>(ResultType.Err, value);
}
