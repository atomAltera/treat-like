import {treat} from "./chain";
import {createContinueResult, createErrorResult} from "./result-builders";
import {Result} from "./types";

// Types
type Sizable = number | string | ArrayLike<any>;

/**
 * Checks input is grater then *size* if number or has grater length then *size* if string or array
 * @param size
 */
export const gt = <T extends Sizable>(size: number) => treat(
    (input: T): Result<T, never, string> => {
        if (typeof input === "number") {
            return input > size ? createContinueResult(input) : createErrorResult("too_small")
        }

        if (typeof input === "string") {
            return input.length > size ? createContinueResult(input) : createErrorResult("too_short")
        }

        if (Array.isArray(input)) {
            return input.length > size ? createContinueResult(input) : createErrorResult("too_short")
        }

        return createErrorResult("invalid_type");
    }
);

/**
 * Checks input is grater or equal to *size* if number or has grater or equal length then *size* if string or array
 * @param size
 */
export const gte = <T extends Sizable>(size: number) => treat(
    (input: T): Result<T, never, string> => {
        if (typeof input === "number") {
            return input >= size ? createContinueResult(input) : createErrorResult("too_small")
        }

        if (typeof input === "string") {
            return input.length >= size ? createContinueResult(input) : createErrorResult("too_short")
        }

        if (Array.isArray(input)) {
            return input.length >= size ? createContinueResult(input) : createErrorResult("too_short")
        }

        return createErrorResult("invalid_type");
    }
);

/**
 * Checks input is less then *size* if number or has shorter length as *size* if string or array
 * @param size
 */
export const lt = <T extends Sizable>(size: number) => treat(
    (input: T): Result<T, never, string> => {
        if (typeof input === "number") {
            return input < size ? createContinueResult(input) : createErrorResult("too_big")
        }

        if (typeof input === "string") {
            return input.length < size ? createContinueResult(input) : createErrorResult("too_long")
        }

        if (Array.isArray(input)) {
            return input.length < size ? createContinueResult(input) : createErrorResult("too_long")
        }

        return createErrorResult("invalid_type");
    }
);

/**
 * Checks input is less or equal to *size* if number or has shorter or equal length as *size* if string or array
 * @param size
 */
export const lte = <T extends Sizable>(size: number) => treat(
    (input: T): Result<T, never, string> => {
        if (typeof input === "number") {
            return input <= size ? createContinueResult(input) : createErrorResult("too_big")
        }

        if (typeof input === "string") {
            return input.length <= size ? createContinueResult(input) : createErrorResult("too_long")
        }

        if (Array.isArray(input)) {
            return input.length <= size ? createContinueResult(input) : createErrorResult("too_long")
        }

        return createErrorResult("invalid_type");
    }
);

/**
 * Checks input matches *regexp*
 * @param regexp
 */
export const match = (regexp: RegExp | string) => treat(
    (input: string): Result<string, never, string> => {
        if (typeof input !== "string") {
            return createErrorResult("invalid_type")
        }

        return input.match(regexp) ? createContinueResult(input) : createErrorResult("invalid_format")
    }
);
