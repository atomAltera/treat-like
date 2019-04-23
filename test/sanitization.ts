import {expect} from 'chai';
import 'mocha';
import {treat, sanitize, provided} from "../src";

const string = treat<string>();
const requiredString = string.mu(provided, "must be provided");

describe('Sanitization', () => {

    describe("Plain schemes", () => {
        const schema = {
            name: requiredString,
            email: requiredString,
        };

        it("ok on valid data", async () => {

            const input = {
                name: "Konstantin Alikhanov",
                email: "atomaltera@gmail.com"
            };

            const report = await sanitize(schema, input);

            expect(report.ok).to.equal(true);
        });

        it("not ok on valid data", async () => {

            const input = {
            };

            const report = await sanitize(schema, input);

            expect(report.ok).to.equal(false);
        });

    });

    describe("Nested schemes", () => {
        const schema = {
            name: requiredString,
            contacts: {
                email: requiredString,
                phone: requiredString,
            }
        };

        it("ok on valid data", async () => {

            const input = {
                name: "Konstantin Alikhanov",
                contacts: {
                    email: "atomaltera@gmail.com",
                    phone: "123 11 11 11"
                }
            };

            const report = await sanitize(schema, input);

            expect(report.ok).to.equal(true);
        });

        it("not ok on valid data", async () => {

            const input = {
            };

            const report = await sanitize(schema, input);

            expect(report.ok).to.equal(false);
        });

    });

});
