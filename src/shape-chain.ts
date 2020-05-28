import {Result, Step} from "./types";
import {createContinueResult, createErrorResult} from "./result-builders";
import {treat} from "./chain";

// Types
export type Shape = {
    [key: string]: Step<any, any, any, any>;
}

export type ShapeInput<S extends Shape> = {
    [K in keyof S]: S[K] extends Step<infer I, any, any, any> ? I : never;
}

export type ShapeOutput<S extends Shape> = {
    [K in keyof S]: S[K] extends Step<any, infer CO, infer SO, any> ? CO | SO : never;
}

export type ShapeErrors<S extends Shape> = {
    [K in keyof S]: S[K] extends Step<any, any, any, infer E> ? E | undefined : never;
};


/**
 * Creates object validation chain from given scheme
 * @param scheme
 */
export const shape = <S extends Shape>(scheme: S) => {
    return treat((input: unknown): Result<ShapeOutput<S>, never, ShapeErrors<S>> => {

        if (input === null || input === undefined) {
            input = {};
        }

        const error = {} as ShapeErrors<S>;
        const output = {} as ShapeOutput<S>;

        let hasErrors = false;

        const keys = Object.keys(scheme) as (keyof ShapeInput<S>)[];

        for (const key of keys) {
            const fieldStep = scheme[key];
            const fieldInput = (input as ShapeInput<S>)[key];

            const fieldResult = fieldStep(fieldInput);

            if (fieldResult.ok) {
                output[key as keyof S] = fieldResult.output;
            } else {
                hasErrors = true;
                error[key as keyof S] = fieldResult.error;
            }
        }

        if (hasErrors) {
            return createErrorResult(error);
        } else {
            return createContinueResult(output);
        }
    });
};
