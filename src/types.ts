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


// Step type
export interface Step<I, CO = I, SO = never, E = never> {
    (input: I): Result<CO, SO, E>;
}

// Chain type
export interface Chain<I, CO = I, SO = never, E = never> extends Step<I, CO, SO, E> {
    then<CO1, SO1 = never, E1 = never>(step: Step<CO, CO1, SO1, E1>): Chain<I, CO1, SO1 | SO, E1 | E>
}
