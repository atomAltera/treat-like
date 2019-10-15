import {Chain} from "./types";
import {createContinueResult, createErrorResult} from "./result-builders";
import {treat} from "./chain";

// Types
type Scheme = {
    [key: string]: Chain<any, any, any, any>;
}

type ShapeInput<S extends Scheme> = {
    [K in keyof S]: S[K] extends Chain<infer I, any, any, any> ? I : never;
}

type ShapeOutput<S extends Scheme> = {
    [K in keyof S]: S[K] extends Chain<any, infer CO, infer SO, any> ? CO | SO : never;
}

type ShapeErrors<S extends Scheme> = {
    [K in keyof S]: S[K] extends Chain<any, any, any, infer E> ? E | undefined : never;
}


/**
 * Creates object validation chain from given scheme
 * @param scheme
 */
export const shape = <S extends Scheme>(scheme: S) => {
    return treat((input: ShapeInput<S>) => {

        const keys = Object.keys(scheme) as (keyof ShapeInput<S>)[];

        const error: ShapeErrors<S> = {} as any;
        const output: ShapeOutput<S> = {} as any;

        for (const key of keys) {
            const fieldChain = scheme[key];
            const fieldInput = input[key];

            const fieldResult = fieldChain(fieldInput);

            if (fieldResult.ok) {
                output[key] = fieldResult.output;
            } else {
                error[key] = fieldResult.error;
            }
        }

        if (Object.keys(error).length > 0) {
            return createErrorResult(error);
        } else {
            return createContinueResult(output);
        }
    });
};
