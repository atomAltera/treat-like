import {any, boolean, byDefault, number, optional, required, string, unknown} from "../../src/scalar-chains";
import {createContinueResult, createErrorResult, createStopResult} from "../../src/result-builders";
import {createTestsForChain} from "../utils";


describe("any", () => {
    describe("noop chain", () => {
        const input = Symbol();
        const expectedResult = createContinueResult(input);

        createTestsForChain(any, input, expectedResult)
    });
});

describe("unknown", () => {
    describe("noop chain", () => {
        const input = Symbol();
        const expectedResult = createContinueResult(input);

        createTestsForChain(unknown, input, expectedResult)
    });
});

describe("required", () => {
    describe("passes not null and not undefined inputs", () => {
        const input = Symbol();
        const expectedResult = createContinueResult(input);

        createTestsForChain(required, input, expectedResult)
    });

    describe("ends with error on null input", () => {
        const input = null;
        const expectedResult = createErrorResult("required");

        createTestsForChain(required, input, expectedResult)
    });

    describe("ends with error on undefined input", () => {
        const input = undefined;
        const expectedResult = createErrorResult("required");

        createTestsForChain(required, input, expectedResult)
    });
});

describe("optional", () => {
    describe("passes not null and not undefined inputs", () => {
        const input = Symbol();
        const expectedResult = createContinueResult(input);

        createTestsForChain(optional, input, expectedResult)
    });

    describe("ends with stop on null input", () => {
        const input = null;
        const expectedResult = createStopResult(input);

        createTestsForChain(optional, input, expectedResult)
    });

    describe("ends with stop on undefined input", () => {
        const input = undefined;
        const expectedResult = createStopResult(input);

        createTestsForChain(optional, input, expectedResult)
    });
});

describe("byDefault", () => {
    describe("passes not null and not undefined inputs", () => {
        const defaultValue = Symbol();
        const chain = byDefault(defaultValue);
        const input = Symbol();
        const expectedResult = createContinueResult(input);

        createTestsForChain(chain, input, expectedResult);
    });

    describe("ends with stop on null input", () => {
        const defaultValue = Symbol();
        const chain = byDefault(defaultValue);
        const input = null;
        const expectedResult = createStopResult(defaultValue);

        createTestsForChain(chain, input, expectedResult);
    });

    describe("ends with stop on undefined input", () => {
        const defaultValue = Symbol();
        const chain = byDefault(defaultValue);
        const input = undefined;
        const expectedResult = createStopResult(defaultValue);

        createTestsForChain(chain, input, expectedResult);
    });
});

describe("string", () => {
    describe("passes string inputs", () => {
        const input = "hello";
        const expectedResult = createContinueResult(input);

        createTestsForChain(string, input, expectedResult)
    });

    describe("ends with error on not string input", () => {
        const input = 12;
        const expectedResult = createErrorResult("not_a_string");

        createTestsForChain(string, input, expectedResult)
    });
});

describe("number", () => {
    describe("passes number inputs", () => {
        const input = 50;
        const expectedResult = createContinueResult(input);

        createTestsForChain(number, input, expectedResult)
    });

    describe("ends with error on not number input", () => {
        const input = true;
        const expectedResult = createErrorResult("not_a_number");

        createTestsForChain(number, input, expectedResult)
    });
});

describe("boolean", () => {
    describe("passes boolean inputs", () => {
        const input = true;
        const expectedResult = createContinueResult(input);

        createTestsForChain(boolean, input, expectedResult)
    });

    describe("ends with error on not boolean input", () => {
        const input = Symbol();
        const expectedResult = createErrorResult("not_a_boolean");

        createTestsForChain(boolean, input, expectedResult)
    });
});
