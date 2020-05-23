import {check, createContinueResult, createErrorResult, typeCheck} from "../../src";
import {createTestsForChain} from "../utils";


describe("check", () => {
    const predicate = (x: number) => x > 10;
    const chain = check(predicate, "must_be_gt_10")


    describe("passes inputs if predicate is true", () => {
        const input = 12;
        const expectedResult = createContinueResult(input);

        createTestsForChain(chain, input, expectedResult)
    });

    describe("ends with error if predicate is false", () => {
        const input = 4;
        const expectedResult = createErrorResult("must_be_gt_10");

        createTestsForChain(chain, input, expectedResult)
    });
});


describe("typeCheck", () => {
    const predicate = (x: unknown): x is string => typeof x === "string";
    const chain = typeCheck(predicate, "must_be_a_string")

    describe("passes inputs if predicate is true", () => {
        const input = "hello";
        const expectedResult = createContinueResult(input);

        createTestsForChain(chain, input, expectedResult)
    });

    describe("ends with error if predicate is false", () => {
        const input = 4;
        const expectedResult = createErrorResult("must_be_a_string");

        createTestsForChain(chain, input, expectedResult)
    });
});
