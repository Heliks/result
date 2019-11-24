import { Result } from './result';
import { err, ok } from './utils';

describe('Result', () => {

    it('should switch results when unwrapping a value on an "Err" result.', () => {
        const a = err('I am an error');
        const b = ok('foobar');

        expect(a.or(b).unwrap()).toBe('foobar');
        expect(b.or(a).unwrap()).toBe('foobar');
    });

    it('should exec callback fn when unwrapping a value on a "Err" result', () => {
        const res1 = err('Ba').orElse(() => ok('Foo'));
        const res2 = ok('Bar').orElse(() => ok(null));

        expect(res1.unwrap()).toBe('Foo');
        expect(res2.unwrap()).toBe('Bar');
    });

    it('should switch results when unwrapping an error on a "Ok" result', () => {
        const a = ok(null);
        const b = err('Foobar');

        expect(a.and(b).unwrapErr()).toBe('Foobar');
        expect(b.and(a).unwrapErr()).toBe('Foobar');
    });

    it('should exec callback fn when unwrapping an error on a "Ok" result', () => {
        const res1 = ok(null).andThen(() => err('Foo'));
        const res2 = err('Bar').andThen(() => ok(null));

        expect(res1.unwrapErr()).toBe('Foo');
        expect(res2.unwrapErr()).toBe('Bar');
    });

    it('should return true if result matches ok value', () => {
        const a = ok('Foobar');
        const b = err('Foobar');

        expect(a.contains('Foobar')).toBeTruthy();
        expect(b.contains('Foobar')).toBeFalsy();
    });

    it('should return true if result matches err value', () => {
        const a = err('Foobar');
        const b = ok('Foobar');

        expect(a.containsErr('Foobar')).toBeTruthy();
        expect(b.containsErr('Foobar')).toBeFalsy();
    });

    it('should unwrap the value of an "Ok" result', () => {
        expect(ok('foo').unwrap()).toBe('foo');
    });

    it('should throw an error when attempting to unwrap a value on an "Err" result', () => {
        expect(() => err('foo').unwrap()).toThrowError('foo');
    });

    it('should unwrap if result is "Ok" or a fallback otherwise', () => {
        expect(ok('foo').unwrapOr('bar')).toBe('foo');
        expect(err('foo').unwrapOr('bar')).toBe('bar');
    });

    it('should return the value of an "Err" result', () => {
        expect(err('foo').unwrapErr()).toBe('foo');
    });

    it('should throw an error when called on an "Ok" result.', () => {
        expect(() => ok('foo').unwrapErr()).toThrowError('foo');
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
