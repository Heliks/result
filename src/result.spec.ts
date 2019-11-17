import { err, ok } from './utils';

describe('Result', () => {

    it('should return an alternative result if the first one is "ResultType.Err"', () => {
        const a = err('foo');
        const b = ok('bar');

        expect(a.or(b).unwrap()).toBe('bar');
        expect(b.or(a).unwrapErr()).toBe('foo');
    });

    it('should call the callback function if the first result is "Err"', () => {
        const res1 = err(null).orElse(() => ok('Foo'));
        const res2 = ok('Foo').orElse(() => ok(null));

        expect(res1.unwrap()).toBe('Foo');
        expect(res2.unwrap()).toBe('Bar');
    });

    it('should return an alternative result if the first one is "Ok"', () => {
        const a = ok('foo');
        const b = err('bar');

        expect(a.and(b).unwrapErr()).toBe('bar');
        expect(b.and(a).unwrap()).toBe('foo');
    });

    it('should call the callback function if the first result is "Ok"', () => {
        const res1 = ok(null).andThen(() => ok('Foo'));
        const res2 = err('Foo').andThen(() => ok(null));

        expect(res1.unwrap()).toBe('Foo');
        expect(res2.unwrap()).toBe('Bar');
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

        it('should throw an error when called on an "Err" result.', () => {
            expect(() => err('foo').unwrapErr()).toThrowError('foo');
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
