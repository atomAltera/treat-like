import {createContinueResult, transform} from "../../src";
import {createTestsForChain} from "../utils";


describe("transform", () => {
    const func = (x: number) => (x / 50).toFixed(2);

    const chain = transform(func)

    describe("passes valid input", () => {
        const input = 1234;
        const expectedResult = createContinueResult('24.68');

        createTestsForChain(chain, input, expectedResult)
    });
});
