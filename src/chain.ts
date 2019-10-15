import {Chain, Result, Step} from "./types";
import {createErrorResult} from "./result-builders";


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

    function then<CO1, SO1 = never, E1 = never>(newStep: Step<CO, CO1, SO1, E1>): Chain<I, CO1, SO | SO1, E | E1> {
        return treat(joinSteps(stepClone, newStep));
    }

    const chain = Object.assign(stepClone, {then});
    return Object.freeze(chain);
}

