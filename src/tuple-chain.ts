import {Chain} from "./types";
import {createContinueResult, createErrorResult} from "./result-builders";
import {treat} from "./chain";

// Types
type Scheme = Chain<any, any, any, any>[];

type TupleInput<S extends Scheme> = {
    [K in keyof S]: S[K] extends Chain<infer I, any, any, any> ? I : never;
}

type TupleOutput<S extends Scheme> = {
    [K in keyof S]: S[K] extends Chain<any, infer CO, infer SO, any> ? CO | SO : never;
}

type TupleErrors<S extends Scheme> = {
    [K in keyof S]: S[K] extends Chain<any, any, any, infer E> ? E | undefined : never;
}

/**
 * Creates tuple validation chain from given scheme
 * @param scheme
 */
export const tuple = <S extends Scheme>(...scheme: S) => {
    return treat((input: TupleInput<S>) => {
        const error: TupleErrors<S> = [] as any;
        const output: TupleOutput<S> = [] as any;

        let hasErrors = false;
        for (const i in scheme) {
            const chain = scheme[i];
            const item = input[i];

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
