import { Result } from './result';
import { err, ok } from './utils';

describe('Result', () => {
    it('should switch results if result is "ResultType.Err"', () => {
        const a = err('I am an error');
        const b = ok('foobar');

        expect(a.or(b).unwrap()).toBe('foobar');
        expect(b.or(a).unwrap()).toBe('foobar');
    });

    it('should call the callback function if the first result is "Err"', () => {
        const res1 = err(null).orElse(() => ok('Foo'));
        const res2 = ok('Bar').orElse(() => ok(null));

        expect(res1.unwrap()).toBe('Foo');
        expect(res2.unwrap()).toBe('Bar');
    });

    it('should switch results if result is "ResultType.Ok"', () => {
        const a = ok(null);
        const b = err('Foobar');

        expect(a.and(b).unwrapErr()).toBe('Foobar');
        expect(b.and(a).unwrapErr()).toBe('Foobar');
    });

    it('should call the callback function if the first result is "Ok"', () => {
        const res1 = ok(null).andThen(() => err('Foo'));
        const res2 = err('Bar').andThen(() => ok(null));

        expect(res1.unwrapErr()).toBe('Foo');
        expect(res2.unwrapErr()).toBe('Bar');
    });

    describe('unwrap()', () => {
        it('should return the value of an "Ok" result', () => {
            expect(ok('foo').unwrap()).toBe('foo');
        });

        it('should throw an error when attempting to get the value called on an "Err" result', () => {
            expect(() => err('foo').unwrap()).toThrowError('foo');
        });
    });

    describe('unwrapErr()', () => {
        it('should return the value of an "Err" result', () => {
            expect(err('foo').unwrapErr()).toBe('foo');
        });

        it('should throw an error when called on an "Ok" result.', () => {
            expect(() => ok('foo').unwrapErr()).toThrowError('foo');
        });
    });

    it('should throw if the result is an error', () => {
        expect(() => {
            ok(null).expect('Foo');
            // This should be the call that throw the error. The call above is to rule out false-positives,
            // as the thrown message would be "Foo".
            err(null).expect('Bar');
        }).toThrowError('Bar');
    });
});
