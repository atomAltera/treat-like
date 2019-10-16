import {joinSteps, treat} from "../../src/chain";
import {createContinueResult, createErrorResult, createStopResult} from "../../src/result-builders";
import {createTestsForChain} from "../utils";


describe("treat", () => {
    const f = (x: number) => createContinueResult(x * 2);

    test("does not throw error", () => {
        expect(() => treat(f)).not.toThrow();
    });

    describe("creates chain", () => {
        const chain = treat(f)
            .then(x => createContinueResult({x}))
            .then(x => createContinueResult(JSON.stringify(x)));

        const input = Math.round(Math.random() * 1000);
        const expectedResult = createContinueResult(JSON.stringify({x: input * 2}));

        createTestsForChain(chain, input, expectedResult);
    });

});

describe("joinSteps", () => {

    test("joining two continue steps", () => {
        const step1 = (x: number) => createContinueResult(x * 10);
        const step2 = (x: number) => createContinueResult(x + 2);

        const step = joinSteps(step1, step2);
        expect(step(5)).toEqual(createContinueResult(52));
    });

    test("joining two stop steps", () => {
        const step1 = (x: number) => createStopResult(x * 10);
        const step2 = (x: number) => createStopResult(x + 2);

        const step = joinSteps(step1, step2);
        expect(step(2)).toEqual(createStopResult(20));
    });

    test("joining two error steps", () => {
        const error1: symbol = Symbol();
        const error2: symbol = Symbol();
        const step1 = (x: number) => createErrorResult(error1);
        const step2 = (x: number) => createErrorResult(error2);

        const step = joinSteps(step1, step2);
        expect(step(5)).toEqual(createErrorResult(error1));
    });

    test("joining continue and stop steps", () => {
        const step1 = (x: number) => createContinueResult(x * 10);
        const step2 = (x: number) => createStopResult(x + 2);

        const step = joinSteps(step1, step2);
        expect(step(5)).toEqual(createStopResult(52));
    });

    test("joining stop and continue steps", () => {
        const step1 = (x: number) => createStopResult(x * 10);
        const step2 = (x: number) => createContinueResult(x + 2);

        const step = joinSteps(step1, step2);
        expect(step(5)).toEqual(createStopResult(50));
    });

    test("joining continue and error steps", () => {
        const error = Symbol();
        const step1 = (x: number) => createContinueResult(x * 10);
        const step2 = (x: number) => createErrorResult(error);

        const step = joinSteps(step1, step2);
        expect(step(5)).toEqual(createErrorResult(error));
    });

    test("joining error and continue steps", () => {
        const error = Symbol();
        const step1 = (x: number) => createErrorResult(error);
        const step2 = (x: number) => createContinueResult(x * 10);

        const step = joinSteps(step1, step2);
        expect(step(5)).toEqual(createErrorResult(error));
    });

    test("joining error and stop steps", () => {
        const error = Symbol();
        const step1 = (x: number) => createErrorResult(error);
        const step2 = (x: number) => createStopResult(x + 2);

        const step = joinSteps(step1, step2);
        expect(step(5)).toEqual(createErrorResult(error));
    });

    test("joining stop and error steps", () => {
        const error = Symbol();
        const step1 = (x: number) => createStopResult(x * 10);
        const step2 = (x: number) => createErrorResult(error);

        const step = joinSteps(step1, step2);
        expect(step(5)).toEqual(createStopResult(50));
    });

});
