import {createContinueResult} from "../../src/result-builders";
import {createTestsForChain, number, required, string, uppercase} from "../utils";
import {array} from "../../src/array-chain";
import {tuple} from "../../src/tuple-chain";

describe("array", () => {

    describe("tuple of required (string, number)", () => {
        const chain = tuple(
            required.then(string).then(uppercase),
            required.then(number),
        );

        describe("valid input", () => {
            const input = ["hello", 10];
            const expectedResult = createContinueResult(["HELLO", 10]);

            createTestsForChain(chain, input, expectedResult);
        });

    });

});
