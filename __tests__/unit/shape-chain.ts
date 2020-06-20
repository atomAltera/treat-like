import {createContinueResult, createErrorResult, number, optional, required, shape, string} from "../../src";
import {createTestsForChain,} from "../utils";

describe("shape", () => {

    const chain = shape({
        email: string,
        name: optional.pipe(string),
        age: optional.pipe(number),
    });

    describe("valid input", () => {
        const input = {
            email: "user@example.com",
            name: "John Doe",
            age: 30,
        };

        const expectedResult = createContinueResult(input);

        createTestsForChain(chain, input, expectedResult);
    });

    describe("skipped optional files", () => {
        const input = {
            email: "user@example.com",
        };

        const expectedResult = createContinueResult(input);

        createTestsForChain(chain, input, expectedResult);
    });

    describe("skipped required files", () => {
        const input = {
            name: "John Doe",
            age: 30,
        };

        const expectedResult = createErrorResult({email: "not_a_string"});

        createTestsForChain(chain, input, expectedResult);
    });

    describe("wrong type of optional fields", () => {
        const input = {
            email: "user@example.com",
            name: true,
            age: "hello",
        };

        const expectedResult = createErrorResult({
            name: "not_a_string",
            age: "not_a_number",
        });

        createTestsForChain(chain, input, expectedResult);
    });

    describe("wrong type of required fields", () => {
        const input = {
            email: 123,
            name: "John Doe",
        };

        const expectedResult = createErrorResult({
            email: "not_a_string",
        });

        createTestsForChain(chain, input, expectedResult);
    });

    describe("wrong type of input value", () => {
        const input = 12;

        const expectedResult = createErrorResult({email: "not_a_string"});

        createTestsForChain(chain, input, expectedResult, 0);
    });

    describe("null as input value", () => {
        const input = null;

        const expectedResult = createErrorResult({email: "not_a_string"});

        createTestsForChain(chain, input, expectedResult, 0);
    });

    describe("undefined as input value", () => {
        const input = undefined;

        const expectedResult = createErrorResult({email: "not_a_string"});

        createTestsForChain(chain, input, expectedResult, 0);
    });

    describe("primitive type as input value", () => {
        const input = 123;

        const expectedResult = createErrorResult({email: "not_a_string"});

        createTestsForChain(chain, input, expectedResult, 0);
    });

    describe("work ok with functions", () => {
        const chain = shape({
            apply: required,
            x: required,
        });

        function f() {
        }

        const input = Object.assign(f, {x: 10});

        const expectedResult = createContinueResult({
            apply: f.apply,
            x: input.x
        });

        createTestsForChain(chain, input, expectedResult, 0);
    })

});
