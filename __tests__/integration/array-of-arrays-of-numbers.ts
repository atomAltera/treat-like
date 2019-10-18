import {array, createContinueResult, createErrorResult, number, required, treat} from "../../src";


describe("array of arrays of numbers", () => {
    const mul2 = treat((x: number) => createContinueResult(x * 2));

    const chain = array(array(required.then(number).then(mul2)));

    test("valid input", () => {
        const input = [
            [1, 2, 6, 2],
            [5, 8, 10, 23],
            [4, 2, 5, 2]
        ];

        const output = [
            [1, 2, 6, 2].map(x => x * 2),
            [5, 8, 10, 23].map(x => x * 2),
            [4, 2, 5, 2].map(x => x * 2)
        ];

        const expectedResult = createContinueResult(output);

        expect(chain(input)).toEqual(expectedResult);
    });

    test("invalid type of sub element", () => {
        const input = [
            [1, 2, 6, 2],
            [5, 8, '10', 23],
            [4, 2, 5, 2]
        ];

        const output = [
            undefined,
            [undefined, undefined, "not_a_number", undefined],
            undefined,
        ];

        const expectedResult = createErrorResult(output);

        expect(chain(input)).toEqual(expectedResult);
    });

});
