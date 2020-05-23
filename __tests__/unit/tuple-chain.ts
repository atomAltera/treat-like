import {array, createContinueResult, createErrorResult, number, string, tuple} from "../../src";
import {createTestsForChain, uppercase} from "../utils";

describe("array", () => {

    describe("tuple of required (string, number)", () => {
        const chain = tuple(
            string.then(uppercase),
            number,
        );

        describe("valid input", () => {
            const input = ["hello", 10];
            const expectedResult = createContinueResult(["HELLO", 10]);

            createTestsForChain(chain, input, expectedResult);
        });

        describe("null instead of required value", () => {
            const input = ["hello", null];
            const expectedResult = createErrorResult([undefined, "not_a_number"]);

            createTestsForChain(chain, input, expectedResult, 0);
        });

        describe("value of wrong type instead of required value", () => {
            const input = [10, 20];
            const expectedResult = createErrorResult(["not_a_string", undefined]);

            createTestsForChain(chain, input, expectedResult, 0);
        });

        describe("wrong type of input value", () => {
            const input = 12;

            const expectedResult = createErrorResult("not_an_array");

            createTestsForChain(chain, input, expectedResult, 0);
        });

        describe("null as input value", () => {
            const input = null;

            const expectedResult = createErrorResult("not_an_array");

            createTestsForChain(chain, input, expectedResult, 0);
        });

        describe("undefined as input value", () => {
            const input = undefined;

            const expectedResult = createErrorResult("not_an_array");

            createTestsForChain(chain, input, expectedResult, 0);
        });

        describe("invalid tuple length", () => {
            const input = ["hello", 10, 20];
            const expectedResult = createErrorResult("invalid_array_length");

            createTestsForChain(chain, input, expectedResult);
        });

    });

});
