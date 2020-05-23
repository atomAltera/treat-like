import {treat} from "./chain";
import {Result} from "./types";
import {createContinueResult, createStopResult} from "./result-builders";
import {check, typeCheck} from "./predicate-chain";


/**
 * NOOP chain with *any* type
 */
export const any = treat<any>(createContinueResult);

/**
 * NOOP chain with *unknown* type
 */
export const unknown = treat<unknown>(createContinueResult);


/**
 * Validates input value not a null or undefined
 */
export const required = check(value => value !== null && value !== undefined, "required")


/**
 * Stops chain if value is null or undefined
 */
export const optional = treat(
    <T>(value: T | null | undefined): Result<T, null | undefined, never> =>
        value === null || value === undefined ? createStopResult(value as null | undefined) : createContinueResult(value)
);


/**
 * Stops chain if value is null or undefined and outputs provided *value*
 * @param value
 */
export const byDefault = <T>(value: T) => treat(
    <I>(input: I | null | undefined): Result<I, T, never> =>
        input === null || input === undefined ? createStopResult(value) : createContinueResult(input)
);


/**
 * Validates input value is string
 */
export const string = typeCheck((x): x is string => typeof x === "string", "not_a_string")

/**
 * Validates input value is number
 */
export const number = typeCheck((x): x is number => typeof x === "number", "not_a_number")

/**
 * Validates input value is boolean
 */
export const boolean = typeCheck((x): x is boolean => typeof x === "boolean", "not_a_boolean")
