import {Result, Step} from "./types";
import {createContinueResult, createErrorResult} from "./result-builders";
import {treat} from "./chain";

// Types
type Scheme = Step<any, any, any, any>[];

type TupleInput<S extends Scheme> = {
    [K in keyof S]: S[K] extends Step<infer I, any, any, any> ? I : never;
}

type TupleOutput<S extends Scheme> = {
    [K in keyof S]: S[K] extends Step<any, infer CO, infer SO, any> ? CO | SO : never;
}

type TupleErrors<S extends Scheme> = {
    [K in keyof S]: S[K] extends Step<any, any, any, infer E> ? E | undefined : never;
}

/**
 * Creates tuple validation chain from given scheme
 * @param scheme
 */
export const tuple = <S extends Scheme>(...scheme: S) => {
    return treat((input: TupleInput<S>): Result<TupleOutput<S>, never, TupleErrors<S> | string> => {
        const error: TupleErrors<S> = [] as any;
        const output: TupleOutput<S> = [] as any;

        if (!Array.isArray(input)) {
            return createErrorResult("not_an_array");
        }

        if (input.length !== scheme.length) {
            return createErrorResult("invalid_array_length");
        }

        let hasErrors = false;
        for (const i in scheme) {
            const step = scheme[i];
            const item = input[i];

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
