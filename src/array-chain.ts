import {Chain} from "./types";
import {createContinueResult, createErrorResult} from "./result-builders";
import {treat} from "./chain";


/**
 * Creates array validation chain from given chain
 * @param chain
 */
export const array = <I, CO, SO, E>(chain: Chain<I, CO, SO, E>) => {
    return treat((input: I[]) => {
        const error: (E | undefined)[] = [];
        const output: (CO | SO)[] = [];

        let hasErrors = false;

        for (const item of input) {

            const result = chain(item);

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
