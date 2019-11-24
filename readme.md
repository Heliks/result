Alternative error handling heavily based on rusts implementation of [std::result::Result](https://doc.rust-lang.org/std/result/index.html).


The result comes in one of two states, `Ok` representing a successful result containing a value,
and `Err` representing an error containing an error value.


```ts
function division(val: number, divisor: number): Result<number> {
     return divisor !== 0 ? ok(val / divisor) : err('Division by zero');
}

// Returns "5"
const a = division(50, 10).unwrap();

// Returns "100"
const b = division(50, 0).or(ok(100)).unwrap();
```
