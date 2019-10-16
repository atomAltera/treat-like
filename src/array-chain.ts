import {Result, Step} from "./types";
import {createContinueResult, createErrorResult} from "./result-builders";
import {treat} from "./chain";


/**
 * Creates array validation chain from given chain
 * @param step
 */
export const array = <I, CO, SO, E>(step: Step<I, CO, SO, E>) => {
    return treat((input: I[]): Result<(CO | SO)[], never, (E | undefined)[] | string> => {
        const error: (E | undefined)[] = [];
        const output: (CO | SO)[] = [];

        if (!Array.isArray(input)) {
            return createErrorResult("not_an_array");
        }

        let hasErrors = false;

        for (const item of input) {

            const result = step(item);

            if (result.ok) {
                output.push(result.output);
                error.push(undefined);
            } else {
                hasErrors = true;
                error.push(result.error);
            }

        }

        if (hasErrors) {
            return createErrorResult(error);
        } else {
            return createContinueResult(output);
        }
    });
};
