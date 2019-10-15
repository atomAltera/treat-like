import {createContinueResult} from "./result-builders";
import {createTestsForChain, required, string, uppercase} from "./test-utils";
import {array} from "./array-chain";

describe("array", () => {

    describe("array of required string", () => {
        const chain = array(required.then(string).then(uppercase));

        describe("valid input", () => {
            const input = ["hello", "world"];
            const expectedResult = createContinueResult(input.map(x => x.toLocaleUpperCase()));

            createTestsForChain(chain, input, expectedResult);
        });

    });

});
