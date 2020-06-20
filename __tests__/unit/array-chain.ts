import {array, createContinueResult, createErrorResult, string} from "../../src";
import {createTestsForChain, uppercase} from "../utils";

describe("array", () => {

    describe("array of required string", () => {
        const chain = array(string.and(uppercase));

        describe("valid input", () => {
            const input = ["hello", "world"];
            const expectedResult = createContinueResult(input.map(x => x.toLocaleUpperCase()));

            createTestsForChain(chain, input, expectedResult);
        });

        describe("treats empty arrays", () => {
            const input: any[] = [];
            const expectedResult = createContinueResult([]);

            createTestsForChain(chain, input, expectedResult);
        });

        describe("null instead of required value", () => {
            const input = ["hello", null];
            const expectedResult = createErrorResult([undefined, "not_a_string"]);

            createTestsForChain(chain, input, expectedResult, 0);
        });

        describe("value of wrong type instead of required value", () => {
            const input = [10, "foo"];
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
    });

});
