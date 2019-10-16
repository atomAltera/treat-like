import {
    array,
    boolean,
    byDefault,
    createContinueResult,
    createErrorResult,
    required,
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

    const lt = <T extends (string | number | Array<any>)>(count: number) =>
        treat((input: T): Result<T, never, string> => {
            if (typeof input === "string") {
                if (input.length < count) {
                    return createContinueResult(input)
                } else {
                    return createErrorResult("too_long")
                }
            }

            if (typeof input === "number") {
                if (input < count) {
                    return createContinueResult(input)
                } else {
                    return createErrorResult("too_big")
                }
            }

            if (Array.isArray(input)) {
                if (input.length < count) {
                    return createContinueResult(input)
                } else {
                    return createErrorResult("too_long")
                }
            }

            return createErrorResult("wrong_type")
        });


    const email = string.then(x => {
        return x.includes('@') ? createContinueResult(x) : createErrorResult("invalid_email");
    });

    const phone = string.then(x => {
        return x.match(/^\d+$/) ? createContinueResult(x) : createErrorResult("invalid_phone")
    });

    const chain = required.string.then(fromJSON).then(array(shape({
        name: required.string,
        email: required.then(email),
        phones: required.then(array(required.then(phone))).then(lt(3)),
        isActive: byDefault(true).then(boolean),
        meta: byDefault({}).then(shape({
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
