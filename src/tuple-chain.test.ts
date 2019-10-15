import {createContinueResult} from "./result-builders";
import {createTestsForChain, number, required, string, uppercase} from "./test-utils";
import {array} from "./array-chain";
import {tuple} from "./tuple-chain";

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
