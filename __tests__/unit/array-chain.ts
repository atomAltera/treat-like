import {createContinueResult} from "../../src/result-builders";
import {createTestsForChain, required, string, uppercase} from "../utils";
import {array} from "../../src/array-chain";

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
