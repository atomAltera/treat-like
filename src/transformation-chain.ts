import {Chain} from "./types";
import {createContinueResult, createErrorResult} from "./result-builders";
import {treat} from "./chain";

type Function<I, O> = (value: I) => O;

/**
 * Creates transformation chain from function
 * @param func
 */
export function transform<I, O>(func: Function<I, O>): Chain<I, O, never, never> {
    return treat((x: I) => createContinueResult(func(x)))
}
