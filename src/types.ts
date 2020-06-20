// Result types
export interface ContinueResult<CO> {
    ok: true;
    stop: false;
    output: CO;
    error: undefined;
}

export interface StopResult<SO> {
    ok: true;
    stop: true;
    output: SO;
    error: undefined;
}

export interface ErrorResult<E> {
    ok: false;
    stop: true;
    output: undefined;
    error: E;
}


export type Result<CO, SO = never, E = never> = ContinueResult<CO> | StopResult<SO> | ErrorResult<E>;


// Step types
export interface Step<I, CO = I, SO = never, E = never> {
    (input: I): Result<CO, SO, E>;
}

export type StepInput<T> = T extends Step<infer I, any, any, any> ? I : never;
export type StepOutput<T> = T extends Step<any, infer CO, infer SO, any> ? CO | SO : never;
export type StepError<T> = T extends Step<any, any, any, infer E> ? E : never;

// Chain types
export interface Chain<I, CO = I, SO = never, E = never> extends Step<I, CO, SO, E> {
    then<CO1, SO1 = never, E1 = never>(step: Step<CO, CO1, SO1, E1>): Chain<I, CO1, SO1 | SO, E1 | E>
    pipe<CO1, SO1 = never, E1 = never>(step: Step<CO, CO1, SO1, E1>): Chain<I, CO1, SO1 | SO, E1 | E>
}

export type ChainInput<T> = T extends Chain<infer I, any, any, any> ? I : never;
export type ChainOutput<T> = T extends Chain<any, infer CO, infer SO, any> ? CO | SO : never;
export type ChainError<T> = T extends Chain<any, any, any, infer E> ? E : never;
