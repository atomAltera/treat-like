import {Chain, Result, Step} from "./types";
import {createErrorResult} from "./result-builders";

let THEN_DEPRECATED_WARNING_TEXT = "treat-like: .then chain method is DEPRECATED and will be removed in release version, use .pipe instead";
let DEPRECATION_WARNING_HAS_BEEN_SHOWN = false;


/**
 * Joins two steps to one
 * @param step1
 * @param step2
 */
export function joinSteps<I, CO1 = I, SO1 = never, E1 = never, CO2 = I, SO2 = never, E2 = never>(step1: Step<I, CO1, SO1, E1>, step2: Step<CO1, CO2, SO2, E2>): Step<I, CO2, SO1 | SO2, E1 | E2> {
    return function step(value: I): Result<CO2, SO1 | SO2, E1 | E2> {
        try {
            const lastResult = step1(value);

            if (!lastResult.ok || lastResult.stop) {
                return lastResult;
            }

            return step2(lastResult.output);

        } catch (e) {
            // TODO: Do not pass internal error
            return createErrorResult(e);
        }
    }
}



/**
 * Creates chain from *step* function
 * @param step
 */
export function treat<I, CO = I, SO = never, E = never>(step: Step<I, CO, SO, E>): Chain<I, CO, SO, E> {
    const stepClone = (input: I) => step(input);

    function pipe<CO1, SO1 = never, E1 = never>(newStep: Step<CO, CO1, SO1, E1>): Chain<I, CO1, SO | SO1, E | E1> {
        return treat(joinSteps(stepClone, newStep));
    }

    /**
     * Deprecated
     * @param newStep
     */
    function then<CO1, SO1 = never, E1 = never>(newStep: Step<CO, CO1, SO1, E1>): Chain<I, CO1, SO | SO1, E | E1> {
        if (!DEPRECATION_WARNING_HAS_BEEN_SHOWN) {
            console.warn(THEN_DEPRECATED_WARNING_TEXT);
            DEPRECATION_WARNING_HAS_BEEN_SHOWN = true;
        }

        return pipe(newStep)
    }

    return Object.assign(stepClone, {then, pipe});
}

