import { expect, test } from 'vitest'
import { find, findV2, compose, customFlow, customPipe } from './pure-functions'
import { pipe, flow } from 'fp-ts/lib/function'

test('find function can return the first value found using a predicate', () => {
  const predicateNumber = (x: number) => x % 2 === 0
  const predicateString = (x: string) => x === 'matching string'
  const predicateNullOrUndefined = <T>(x: T) => x == null

  const numberFound = find(predicateNumber, [0,1,2,3,4,5])
  const stringFound = find(predicateString, ['Test', 'this', 'matching string'])
  const nullFound = find(predicateNullOrUndefined, [1, 'test', null])
  const undefinedFound = find(predicateNullOrUndefined, [1, 'test', undefined])
  const notFoundEmpty = find(predicateNullOrUndefined, [])
  const notFoundNonExistant = find(predicateNullOrUndefined, [1,2,3,4])

  expect(numberFound).toBe(2)
  expect(stringFound).toBe('matching string')
  expect(nullFound).toBe(null)
  expect(undefinedFound).toBe(undefined)
  expect(notFoundEmpty).toBe(undefined)
  expect(notFoundNonExistant).toBe(undefined)
})

test('findV2 function can return the first value found using a predicate', () => {
  const predicateNumber = (x: number) => x % 2 === 0
  const predicateString = (x: string) => x === 'matching string'
  const predicateNullOrUndefined = <T>(x: T) => x == null

  const numberFound = pipe(
    [0,1,2,3,4,5],
    findV2(predicateNumber)
  )

  const stringFound = pipe(
    ['Test', 'this', 'matching string'],
    findV2(predicateString)
  )

  const nullFound = pipe(
    [1, 'test', null],
    findV2(predicateNullOrUndefined)
  )

  const undefinedFound = pipe(
    [1, 'test', undefined],
    findV2(predicateNullOrUndefined)
  )

  const notFoundEmpty = pipe(
    [],
    findV2(predicateNullOrUndefined)
  )

  const notFoundNonExistant = pipe(
    [1,2,3,4],
    findV2(predicateNullOrUndefined)
  )

  expect(numberFound).toBe(2)
  expect(stringFound).toBe('matching string')
  expect(nullFound).toBe(null)
  expect(undefinedFound).toBe(undefined)
  expect(notFoundEmpty).toBe(undefined)
  expect(notFoundNonExistant).toBe(undefined)
})

test('compose will compose two functions together', () => {
  const len = (s: string): number => s.length
  const double = (n: number): number => n * 2

  const f = compose(len)(double)

  expect(f('aaa')).toBe(6)
})

test('customFlow will handle one function supplied', () => {
  const len = (s: string): number => s.length

  const customResult = customFlow(len)
  const fptsResults = flow(len)

  expect(customResult('aaa')).toEqual(fptsResults('aaa'))
})

test('customFlow will compose two functions together', () => {
  const len = (s: string): number => s.length
  const double = (n: number): number => n * 2

  const customResult = customFlow(len, double)
  const fptsResults = flow(len, double)

  expect(customResult('aaa')).toEqual(fptsResults('aaa'))
})

test('customFlow will compose multiple functions together', () => {
  const len = (s: string): number => s.length
  const double = (n: number): number => n * 2
  const castToString = <T extends Object>(val: T) => val.toString()

  const customResult = customFlow(len, double, double, castToString)
  const fptsResults = flow(len, double, double, castToString)

  expect(customResult('aaa')).toEqual(fptsResults('aaa'))
})

test('customPipe will compose multiple functions and run them on supplied values', () => {
  const len = (s: string): number => s.length
  const double = (n: number): number => n * 2
  
  const customResult = customPipe('aaa', len, double, double)
  const fptsResults = pipe('aaa', len, double, double)

  expect(customResult).toEqual(fptsResults)
})