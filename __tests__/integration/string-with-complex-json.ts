import {
    array,
    boolean,
    byDefault,
    createContinueResult,
    createErrorResult,
    Result,
    shape,
    string,
    treat
} from "../../src";


describe("string with complex json", () => {
    const fromJSON = (x: string) => {
        try {
            return createContinueResult(JSON.parse(x));
        } catch (e) {
            return createErrorResult("invalid_json")
        }
    };

    const lt = <T extends any>(size: number) => treat(
        (input: T): Result<T, never, string> => {
            if (typeof input === "number") {
                return input < size ? createContinueResult(input) : createErrorResult("too_big")
            }

            if (typeof input === "string") {
                return input.length < size ? createContinueResult(input) : createErrorResult("too_long")
            }

            if (Array.isArray(input)) {
                return input.length < size ? createContinueResult(input) : createErrorResult("too_long")
            }

            return createErrorResult("invalid_type");
        }
    );

    const match = (regexp: RegExp | string) => treat(
        (input: string): Result<string, never, string> => {
            if (typeof input !== "string") {
                return createErrorResult("invalid_type")
            }

            return input.match(regexp) ? createContinueResult(input) : createErrorResult("invalid_format")
        }
    );

    const email = string.pipe(match(/^\w+@\w+\.\w+$/));

    const phone = string.pipe(x => {
        return x.match(/^\d+$/) ? createContinueResult(x) : createErrorResult("invalid_phone")
    });

    const chain = string.pipe(fromJSON).pipe(array(shape({
        name: string,
        email: email,
        phones: array(phone).pipe(lt(3)),
        isActive: byDefault(true).pipe(boolean),
        meta: byDefault({}).pipe(shape({
            foo: byDefault("bar")
        }))
    })));

    test("valid input", () => {

        const input = `[
            {
                "name": "John Doe",
                "email": "john@example.com",
                "phones": ["1234", "5678"],
                "meta": {
                    "foo": "hello",
                    "bar": "baz"
                }
            },
            {
                "name": "Alisa Doe",
                "email": "alisa@example.com",
                "phones": ["5432", "5678"],
                "isActive": false
            }
        ]`;

        const output = [
            {
                name: "John Doe",
                email: "john@example.com",
                phones: ["1234", "5678"],
                isActive: true,
                meta: {
                    foo: "hello",
                }
            },
            {
                name: "Alisa Doe",
                email: "alisa@example.com",
                phones: ["5432", "5678"],
                isActive: false,
                meta: {},
            }
        ];

        expect(chain(input)).toEqual(createContinueResult(output));
    });

    test("too many phones", () => {

        const input = `[
            {
                "name": "John Doe",
                "email": "john@example.com",
                "phones": ["1234", "5678", "5533"]
            }
        ]`;

        const error = [
            {
                phones: "too_long",
            },
        ];

        expect(chain(input)).toEqual(createErrorResult(error));
    });

});
