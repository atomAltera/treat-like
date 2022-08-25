import {Chain} from "./types";
import {createContinueResult, createErrorResult} from "./result-builders";
import {treat} from "./chain";

type Predicate<T> = (value: T) => boolean;
type TypePredicate<T> = (value: unknown) => value is T;

/**
 * Creates condition checking chain from predicate
 * @param predicate
 * @param error
 */
export function check<I, E = undefined>(predicate: Predicate<I>, error: E): Chain<I, I, never, E> {
    return treat<I, I, never, E>((x: I) => predicate(x) ? createContinueResult(x) : createErrorResult(error))
}


/**
 * Creates type checking chain from type predicate
 * @param predicate
 * @param error
 */
export function typeCheck<I, E = undefined>(predicate: TypePredicate<I>, error: E): Chain<unknown, I, never, E> {
    return treat<unknown, I, never, E>(x => predicate(x) ? createContinueResult(x) : createErrorResult(error))
}
