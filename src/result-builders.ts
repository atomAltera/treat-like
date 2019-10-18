import {ContinueResult, ErrorResult, StopResult} from "./types";

/**
 * Create *continue result* object with given *output* value
 * @param output
 */
export function createContinueResult<CO>(output: CO): ContinueResult<CO> {
    return Object.freeze({
        ok: true,
        stop: false,
        output,
        error: undefined,
    });
}

/**
 * Create *stop result* object with given *output* value
 * @param output
 */
export function createStopResult<SO>(output: SO): StopResult<SO> {
    return Object.freeze({
        ok: true,
        stop: true,
        output,
        error: undefined,
    });
}

/**
 * Creates *error result* object with given *error* value
 * @param error
 */
export function createErrorResult<E>(error: E): ErrorResult<E> {
    return Object.freeze({
        ok: false,
        stop: true,
        output: undefined,
        error,
    });
}
