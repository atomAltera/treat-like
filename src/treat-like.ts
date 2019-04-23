import {Converter, Input, Pipe, Report, Schema, Validator} from "./types";

const pipeChainMethods = <I, C>(f: () => Pipe<I, C>) => ({
    as: <N>(converter: Converter<C, N>, message?: string): Pipe<I, N> =>
        continueConvertingPipe(converter, f(), message),

    mu: (validator: Validator<C>, message?: string): Pipe<I, C> =>
        continueValidatingPipe(validator, f(), message),
});

const continueValidatingPipe = <I, C>(
    validator: Validator<C>,
    prev: Pipe<I, C>,
    message?: string
) => {
    const pipe: Pipe<I, C> = {
        ap: (x: I) => {
            let prevError: Error | null = null;

            return prev
                .ap(x)
                .catch(e => {
                    throw (prevError = e);
                })
                .then(x => {
                    return Promise.resolve(x)
                        .then(validator)
                        .then(valid => {
                            if (valid) {
                                return x;
                            } else {
                                throw new Error(message || "Validation failed")
                            }
                        })
                        .catch(e => {
                            if (prevError != null) {
                                throw prevError;
                            }

                            throw message ? new Error(message) : new Error("Validation Error");
                        });
                });
        },

        ...pipeChainMethods(() => pipe)
    };

    return pipe;
};

const continueConvertingPipe = <I, C, N>(converter: Converter<C, N>, prev: Pipe<I, C>, message?: string) => {
    const pipe: Pipe<I, N> = {
        ap: (x: I) => {
            let prevError: Error | null = null;

            return prev
                .ap(x)
                .catch(e => {
                    throw (prevError = e);
                })
                .then(converter)
                .catch(e => {
                    if (prevError != null) {
                        throw prevError;
                    }

                    throw message ? new Error(message) : new Error("Converting error");
                });
        },

        ...pipeChainMethods(() => pipe)
    };

    return pipe;
};

export const treat = <I>() => {
    const pipe: Pipe<I, I> = {
        ap: (x: I): Promise<I> => Promise.resolve(x),

        ...pipeChainMethods(() => pipe)
    };

    return pipe;
};

const isPipe = (pipe: any): pipe is Pipe<any, any> => pipe.hasOwnProperty("ap");
const isSchema = (schema: any): schema is Schema => typeof schema == "object" && schema != null;
const isUndefined = (value: any): value is undefined => value == undefined;

type Entries<T, K extends keyof T> = [K, T[K]][];

const entries = <T extends object>(object: T): Entries<T, keyof T> => {
    const result: Entries<T, keyof T> = [];

    for (let key in object) {
        result.push([key, object[key]]);
    }

    return result;
};

export const sanitize = <T extends Schema>(schema: T, input: Input<T>): Promise<Report<T>> => {
    const errors: { [K in keyof T]?: any } = {};
    const values: { [K in keyof T]?: any } = {};

    return Promise.all(
        entries(schema).map(([key, rule]) => {
            let raw: any = input[key];

            if (isPipe(rule)) {
                return rule
                    .ap(raw)
                    .then(value => {
                        values[key] = value;
                    })
                    .catch(e => {
                        errors[key as string] = e.message;
                    });
            }

            if (isSchema(rule)) {
                if (isUndefined(raw)) {
                    raw = {}
                }

                return sanitize(rule, raw).then(report => {
                    if (report.ok) {
                        values[key] = report.values;
                    } else {
                        values[key] = report.values;
                        errors[key] = report.errors;
                    }
                });
            }
        })
    ).then(() => {
        return {
            ok: Object.keys(errors).length == 0,
            values,
            errors
        } as Report<T>
    });
};
