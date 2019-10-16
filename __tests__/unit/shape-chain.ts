import {shape} from "../../src/shape-chain";
import {createContinueResult, createErrorResult} from "../../src/result-builders";
import {createTestsForChain, number, optional, required, string} from "../utils";

describe("shape", () => {

    const chain = shape({
        email: required.then(string),
        name: optional.then(string),
        age: optional.then(number),
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

        const expectedResult = createErrorResult({email: "not_provided"});

        createTestsForChain(chain, input, expectedResult);
    });

    describe("wrong type of optional fields", () => {
        const input = {
            email: "user@example.com",
            name: true,
            age: "hello",
        };

        const expectedResult = createErrorResult({
            name: "must_be_a_string",
            age: "must_be_a_number",
        });

        createTestsForChain(chain, input, expectedResult);
    });

    describe("wrong type of required  fields", () => {
        const input = {
            email: 123,
            name: "John Doe",
        };

        const expectedResult = createErrorResult({
            email: "must_be_a_string",
        });

        createTestsForChain(chain, input, expectedResult);
    });

});
