import { pipe } from "fp-ts/lib/function";
import type { Predicate } from "fp-ts/lib/Predicate";

// This function takes two arguements, a predicate and a list of generic type T
// Instead of being defined on the Array prototype, we pass it in.

// A note on TypeScript:
// <T>(arg: T): T denotes a generic type variable
// This works over a range of types, and will be inferred based on parameters
export const find = <T>(pred: Predicate<T>, ts: T[]): T | undefined => {
  return ts.reduce((prev: T | undefined, curr) => {
    // If previously found, return that item on every call of the reducer
    if (prev) return prev;

    // If the current item satisfies the predicate, return it
    if (pred(curr)) return curr;

    // Else keep returning undefined
    return undefined;
  }, undefined)
};

// A common practice is to take parameters one by one
// And return a function that takes the remaining parameters
// Always pass the data that the functions works with as the last parameter
// You "configure" the function by feeding configuration parameters until its ready for data
// predicate here is a configuration, ts: T[] is data
export const findV2 = <T>(pred: Predicate<T>) => 
  // Or: this takes only a predicate, and returns a function
  // This approach is called curryin
  (ts: T[]): T | undefined => {
    // The predicate logic is now captured by closure
    return ts.reduce((prev: T | undefined, curr) => {
      if (prev) return prev
      if (pred(curr)) return curr
      return undefined
    }, undefined)
  }

// This is how currying looks
// const result = findV2<number>(x => x % 2 === 0)([1,2,3,4,5,6]);

// Alternatively with pipe
const result = pipe(
  // pipe's first parameter is our data
  [1,2,3,4,5,6],
  // the second, and subsequent, parameter are functions
  findV2((x) => x % 2 === 0)
)
// We don't need to explicitely state a type with pipe. It'll be inferred from our data
// The type of the value returned by the last function will be the type of the result

// flow is similar but does not take a data parameter. It can be later used as an invocation with some data passed in

// This function has three generic types given as <A, B, C>
// And it will compose two functions, one of type A => B and another of B => C
// Using this combination we can call the two functions such that our return type is a function (Type A) => C
export const compose = <A, B>(fn: (a: A) => B) => <C>(fn2: (b: B) => C) => (a: A) => fn2(fn(a))

// CustomFlow is a custom implementation of fp-ts's flow function
// We need to pass an array of functions that will return each function composed together
// Any usage here is sort of awkward, but I've found the generic inference to be somewhat frustrating
// This might be why fp-ts limits how many variables can be passed in
export const customFlow = (...fns: Array<(a: any) => any>) => fns.reduce((prev, curr) => compose(prev)(curr))

export const customPipe = <T>(value: T, ...fns: Array<(a: any) => any>) => customFlow(...fns)(value)