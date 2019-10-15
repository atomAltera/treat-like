import {createContinueResult, createErrorResult, createStopResult} from "./result-builders";


describe("createContinueResult", () => {

    test("returns object with *ok* field set true", () => {
        const result = createContinueResult(undefined);

        expect(result.ok).toBeTruthy()
    });

    test("returns object with *stop* field set false", () => {
        const result = createContinueResult(undefined);

        expect(result.stop).toBeFalsy();
    });

    test("returns object with *output* field set to provided value", () => {
        const value = Symbol();
        const result = createContinueResult(value);

        expect(result.output).toBe(value);
    });

    test("returns frozen object", () => {
        const result = createContinueResult(undefined);

        expect(Object.isFrozen(result)).toBeTruthy();
    });

});


describe("createStopResult", () => {

    test("returns object with *ok* field set true", () => {
        const result = createStopResult(undefined);

        expect(result.ok).toBeTruthy()
    });

    test("returns object with *stop* field set true", () => {
        const result = createStopResult(undefined);

        expect(result.stop).toBeTruthy();
    });

    test("returns object with *output* field set to provided value", () => {
        const value = Symbol();
        const result = createStopResult(value);

        expect(result.output).toBe(value);
    });

    test("returns frozen object", () => {
        const result = createStopResult(undefined);

        expect(Object.isFrozen(result)).toBeTruthy();
    });

});


describe("createErrorResult", () => {

    test("returns object with *ok* field set false", () => {
        const result = createErrorResult(undefined);

        expect(result.ok).toBeFalsy()
    });

    test("returns object with *error* field set to provided error", () => {
        const error = Symbol();
        const result = createErrorResult(error);

        expect(result.error).toBe(error);
    });

    test("returns frozen object", () => {
        const result = createErrorResult(undefined);

        expect(Object.isFrozen(result)).toBeTruthy();
    });

});

