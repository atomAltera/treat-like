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
export const string = treat(
    (value: unknown): Result<string, never, string> =>
        typeof value === "string" ? createContinueResult(value) : createErrorResult("not_a_string")
);


/**
 * Validates input value is number
 */
export const number = treat(
    (value: unknown): Result<number, never, string> =>
        typeof value === "number" ? createContinueResult(value) : createErrorResult("not_a_number")
);


/**
 * Validates input value is boolean
 */
export const boolean = treat(
    (value: unknown): Result<boolean, never, string> =>
        typeof value === "boolean" ? createContinueResult(value) : createErrorResult("not_a_boolean")
);



let r = string(null);

if (r.ok) {
    let y = r.output;
} else {
    let y = r.error;
}
