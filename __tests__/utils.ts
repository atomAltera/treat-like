import {Chain, createContinueResult, createErrorResult, createStopResult, Result, treat} from "../src";

export const required = treat(
    (x: unknown) => x === undefined || x === null ? createErrorResult("not_provided") : createContinueResult(x)
);

export const optional = treat(
    (x: unknown) => x === undefined || x === null ? createStopResult(x) : createContinueResult(x)
);

export const string = treat(
    (x: unknown) => typeof x !== "string" ? createErrorResult("not_a_string") : createContinueResult(x)
);

export const number = treat(
    (x: unknown) => typeof x !== "number" ? createErrorResult("not_a_number") : createContinueResult(x)
);

export const uppercase = treat(
    (x: string) => createContinueResult(x.toLocaleUpperCase())
);

export function createCallTestForChain(chain: Chain<any, any, any, any>, input: any, expectedResult: Result<any, any, any>) {
    test("has a function type", () => {
        expect(typeof chain).toBe('function');
    });

    test("returns expected result", () => {
        expect(chain(input)).toEqual(expectedResult);
    });
}


export function createExtendTestsForChain(chain: Chain<any, any, any, any>, input: any, expectedResult: Result<any, any, any>, depth: number = 4) {
    test("has *then* method", () => {
        expect(typeof chain.then).toBe("function");
    });


    if (expectedResult.ok && !expectedResult.stop) {

        describe("*then* method extends continue chain with continue step", () => {

            const step = (x: any) => createContinueResult({hello: x});
            const newChain = chain.then(step);
            const newExpectedResult = step(expectedResult.output);

            createTestsForChain(newChain, input, newExpectedResult, --depth);
        });

        describe("*then* method extends continue chain with stop step", () => {

            const step = (x: any) => createStopResult({hello: x});
            const newChain = chain.then(step);
            const newExpectedResult = step(expectedResult.output);

            createTestsForChain(newChain, input, newExpectedResult, --depth);
        });

        describe("*then* method extends continue chain with error step", () => {

            const error = Symbol();
            const step = (x: any) => createErrorResult(error);
            const newChain = chain.then(step);
            const newExpectedResult = createErrorResult(error);

            createTestsForChain(newChain, input, newExpectedResult, --depth);
        });

    } else if (expectedResult.ok && expectedResult.stop) {

        describe("*then* method extends stop chain with continue step", () => {

            const step = (x: any) => createContinueResult({hello: x});
            const newChain = chain.then(step);

            createTestsForChain(newChain, input, expectedResult, --depth);
        });

        describe("*then* method extends stop chain with stop step", () => {

            const step = (x: any) => createStopResult({hello: x});
            const newChain = chain.then(step);

            createTestsForChain(newChain, input, expectedResult, --depth);
        });

        describe("*then* method extends stop chain with error step", () => {

            const error = Symbol();
            const step = (x: any) => createErrorResult(error);
            const newChain = chain.then(step);

            createTestsForChain(newChain, input, expectedResult, --depth);
        });

    } else {

        describe("*then* method extends error chain with continue step", () => {

            const step = (x: any) => createContinueResult({hello: x});
            const newChain = chain.then(step);

            createTestsForChain(newChain, input, expectedResult, --depth);
        });

        describe("*then* method extends error chain with stop step", () => {

            const step = (x: any) => createStopResult({hello: x});
            const newChain = chain.then(step);

            createTestsForChain(newChain, input, expectedResult, --depth);
        });

        describe("*then* method extends error chain with error step", () => {

            const error = Symbol();
            const step = (x: any) => createErrorResult(error);
            const newChain = chain.then(step);

            createTestsForChain(newChain, input, expectedResult, --depth);
        });


    }


}


export function createTestsForChain(chain: Chain<any, any, any, any>, input: any, expectedResult: Result<any, any, any>, depth: number = 2) {
    describe("is valid chain", () => {
        createCallTestForChain(chain, input, expectedResult);
        depth > 0 && createExtendTestsForChain(chain, input, expectedResult, depth);
    });
}

