import {Result, Step} from "./types";
import {createContinueResult, createErrorResult} from "./result-builders";
import {treat} from "./chain";

// Types
export type Tuple = Step<any, any, any, any>[];

export type TupleInput<S extends Tuple> = {
    [K in keyof S]: S[K] extends Step<infer I, any, any, any> ? I : never;
}

export type TupleOutput<S extends Tuple> = {
    [K in keyof S]: S[K] extends Step<any, infer CO, infer SO, any> ? CO | SO : never;
}

export type TupleErrors<S extends Tuple> = {
    [K in keyof S]: S[K] extends Step<any, any, any, infer E> ? E | undefined : never;
}

/**
 * Creates tuple validation chain from given scheme
 * @param scheme
 */
export const tuple = <S extends Tuple>(...scheme: S) => {
    return treat((input: unknown): Result<TupleOutput<S>, never, TupleErrors<S> | string> => {
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
