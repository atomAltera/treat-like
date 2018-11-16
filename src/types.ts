export type Converter<A, B> = (a: A) => B | Promise<B>;
export type Validator<A> = (a: A) => boolean | Promise<boolean>;

export interface Pipe<I, C> {
    mu: (validator: Validator<C>, message?: string) => Pipe<I, C>;
    as: <N>(converter: Converter<C, N>, message?: string) => Pipe<I, N>;

    ap(a: I): Promise<C>;
}




export interface Schema {
    [name: string]: Pipe<any, any> | Schema;
}

export type Input<T extends Schema> = {
    [K in keyof T]?: T[K] extends Pipe<infer I, any> ? I : T[K] extends Schema ? Input<T[K]> : never
};

export type FullOutput<T extends Schema> = {
    [K in keyof T]: T[K] extends Pipe<infer I, infer C> ? C : T[K] extends Schema ? FullOutput<T[K]> : never
};

export type PartialOutput<T extends Schema> = {
    [K in keyof T]: T[K] extends Pipe<infer I, infer C>
        ? C | undefined
        : T[K] extends Schema ? PartialOutput<T[K]> : never
};

export type Errors<T extends Schema> = {
    [K in keyof T]: T[K] extends Pipe<infer I, infer C>
        ? string | undefined
        : T[K] extends Schema ? Errors<T[K]> : never
};

export interface OkReport<T extends Schema> {
    ok: true;
    values: FullOutput<T>;
}

export interface ErrorReport<T extends Schema> {
    ok: false;
    errors: Errors<T>;
    values: PartialOutput<T>;
}

export type Report<T extends Schema> = OkReport<T> | ErrorReport<T>;
