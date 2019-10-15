import {treat} from "./chain";
import {Result} from "./types";
import {createContinueResult, createErrorResult, createStopResult} from "./result-builders";


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
export const required = treat(
    <T>(value: T | null | undefined): Result<T, never, string> =>
        value === null || value === undefined ? createErrorResult("required") : createContinueResult(value)
);


/**
 * Stops chain if value is null or undefined
 */
export const optional = treat(
    <T>(value: T | null | undefined): Result<T, null | undefined, never> =>
        value === null || value === undefined ? createStopResult(value as null | undefined) : createContinueResult(value)
);


/**
 * Validates input value is string
 */
export const mustBeString = treat(
    (value: unknown): Result<string, never, string> =>
        typeof value === "string" ? createContinueResult(value) : createErrorResult("not_a_string")
);


/**
 * Validates input value is number
 */
export const mustBeNumber = treat(
    (value: unknown): Result<number, never, string> =>
        typeof value === "number" ? createContinueResult(value) : createErrorResult("not_a_number")
);


/**
 * Chain that checks input value is provided and is a string
 */
export const requiredString = required.then(mustBeString);


/**
 * Chain that allows input value to be null or undefined, otherwise must be a string
 */
export const optionalString = optional.then(mustBeString);


/**
 * Chain that checks input value is provided and is a number
 */
export const requiredNumber = required.then(mustBeNumber);


/**
 * Chain that allows input value to be null or undefined, otherwise must be a number
 */
export const optionalNumber = optional.then(mustBeNumber);
