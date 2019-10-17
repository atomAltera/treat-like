import {gt, gte, lt, lte, match} from "../../src/validation-chains";
import {createContinueResult, createErrorResult} from "../../src";


describe("gt", () => {
    const chain = gt(5);

    test("passes grater numbers", () => {
        expect(chain(6)).toEqual(createContinueResult(6));
    });

    test("passes longer strings", () => {
        expect(chain("hello world")).toEqual(createContinueResult("hello world"));
    });

    test("passes longer arrays", () => {
        expect(chain([1, 2, 3, 4, 5, 6])).toEqual(createContinueResult([1, 2, 3, 4, 5, 6]));
    });

    test("blocks equal numbers", () => {
        expect(chain(5)).toEqual(createErrorResult("too_small"));
    });

    test("blocks equal length strings", () => {
        expect(chain("hello")).toEqual(createErrorResult("too_short"));
    });

    test("blocks equal length arrays", () => {
        expect(chain([1, 2, 3, 4, 5])).toEqual(createErrorResult("too_short"));
    });

    test("blocks less numbers", () => {
        expect(chain(4)).toEqual(createErrorResult("too_small"));
    });

    test("blocks shorter strings", () => {
        expect(chain("foo")).toEqual(createErrorResult("too_short"));
    });

    test("blocks shorter arrays", () => {
        expect(chain([1, 2, 3, 4])).toEqual(createErrorResult("too_short"));
    });

    test("blocks input of unexpected type", () => {
        expect(chain(true as any)).toEqual(createErrorResult("invalid_type"))
    });
});

describe("gte", () => {
    const chain = gte(5);

    test("passes grater numbers", () => {
        expect(chain(6)).toEqual(createContinueResult(6));
    });

    test("passes longer strings", () => {
        expect(chain("hello world")).toEqual(createContinueResult("hello world"));
    });

    test("passes longer arrays", () => {
        expect(chain([1, 2, 3, 4, 5, 6])).toEqual(createContinueResult([1, 2, 3, 4, 5, 6]));
    });

    test("passes equal numbers", () => {
        expect(chain(5)).toEqual(createContinueResult(5));
    });

    test("passes equal length strings", () => {
        expect(chain("hello")).toEqual(createContinueResult("hello"));
    });

    test("passes equal length arrays", () => {
        expect(chain([1, 2, 3, 4, 5])).toEqual(createContinueResult([1, 2, 3, 4, 5]));
    });

    test("blocks less numbers", () => {
        expect(chain(4)).toEqual(createErrorResult("too_small"));
    });

    test("blocks shorter strings", () => {
        expect(chain("foo")).toEqual(createErrorResult("too_short"));
    });

    test("blocks shorter arrays", () => {
        expect(chain([1, 2, 3, 4])).toEqual(createErrorResult("too_short"));
    });

    test("blocks input of unexpected type", () => {
        expect(chain(true as any)).toEqual(createErrorResult("invalid_type"))
    });
});

describe("lt", () => {
    const chain = lt(5);

    test("passes less numbers", () => {
        expect(chain(4)).toEqual(createContinueResult(4));
    });

    test("passes shorter strings", () => {
        expect(chain("foo")).toEqual(createContinueResult("foo"));
    });

    test("passes shorter arrays", () => {
        expect(chain([1, 2, 3, 4])).toEqual(createContinueResult([1, 2, 3, 4]));
    });

    test("blocks equal numbers", () => {
        expect(chain(5)).toEqual(createErrorResult("too_big"));
    });

    test("blocks equal length strings", () => {
        expect(chain("hello")).toEqual(createErrorResult("too_long"));
    });

    test("blocks equal length arrays", () => {
        expect(chain([1, 2, 3, 4, 5])).toEqual(createErrorResult("too_long"));
    });

    test("blocks grater numbers", () => {
        expect(chain(6)).toEqual(createErrorResult("too_big"));
    });

    test("blocks longer strings", () => {
        expect(chain("Hello World")).toEqual(createErrorResult("too_long"));
    });

    test("blocks longer arrays", () => {
        expect(chain([1, 2, 3, 4, 5, 6])).toEqual(createErrorResult("too_long"));
    });

    test("blocks input of unexpected type", () => {
        expect(chain(true as any)).toEqual(createErrorResult("invalid_type"))
    });
});

describe("lte", () => {
    const chain = lte(5);

    test("passes less numbers", () => {
        expect(chain(4)).toEqual(createContinueResult(4));
    });

    test("passes shorter strings", () => {
        expect(chain("foo")).toEqual(createContinueResult("foo"));
    });

    test("passes shorter arrays", () => {
        expect(chain([1, 2, 3, 4])).toEqual(createContinueResult([1, 2, 3, 4]));
    });

    test("passes equal numbers", () => {
        expect(chain(5)).toEqual(createContinueResult(5));
    });

    test("passes equal length strings", () => {
        expect(chain("hello")).toEqual(createContinueResult("hello"));
    });

    test("passes equal length arrays", () => {
        expect(chain([1, 2, 3, 4, 5])).toEqual(createContinueResult([1, 2, 3, 4, 5]));
    });

    test("blocks grater numbers", () => {
        expect(chain(6)).toEqual(createErrorResult("too_big"));
    });

    test("blocks longer strings", () => {
        expect(chain("Hello World")).toEqual(createErrorResult("too_long"));
    });

    test("blocks longer arrays", () => {
        expect(chain([1, 2, 3, 4, 5, 6])).toEqual(createErrorResult("too_long"));
    });

    test("blocks input of unexpected type", () => {
        expect(chain(true as any)).toEqual(createErrorResult("invalid_type"))
    });
});

describe("match", () => {
    const chain = match(/^\w\d+$/);

    test("passes values that match given regexp", () => {
        expect(chain("a1234")).toEqual(createContinueResult("a1234"));
    });

    test("blocks values that dont match given regexp", () => {
        expect(chain("ab123")).toEqual(createErrorResult("invalid_format"));
    });

    test("blocks input of unexpected type", () => {
        expect(chain(true as any)).toEqual(createErrorResult("invalid_type"))
    });
});
