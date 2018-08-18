import {expect} from 'chai';
import 'mocha';
import {gt, gte, lt, lte} from "../src/validators";


describe('Validators', () => {

    describe('Comparative', () => {
        const grater = [28, [1, 34, 2, 4, 1, 2, 3, 1, 2, 3, 1, 0, 5], 'Some long sentence', {length: 34}];
        const less = [3, [1, 3], 'short', {length: 2}];
        const equal1 = [8, [1, 2, 3, 4, 5, 6, 7, 8], '12345678', {length: 8}];
        const equal2 = [8, [8, 7, 6, 5, 4, 3, 2, 1], '87654321', {length: 8}];

        it('gt', () => {
            grater.forEach(g => {
                less.forEach(l => {
                    expect(gt(l)(g)).to.equal(true);
                    expect(gt(g)(l)).to.equal(false);
                })
            })
        });

        it('lt', () => {
            grater.forEach(g => {
                less.forEach(l => {
                    expect(lt(l)(g)).to.equal(false);
                    expect(lt(g)(l)).to.equal(true);
                })
            })
        });

        it('gte', () => {
            grater.forEach(g => {
                less.forEach(l => {
                    expect(gte(l)(g)).to.equal(true);
                    expect(gte(g)(l)).to.equal(false);
                })
            });

            [...grater, ...equal1].forEach(ge => {
                [...less, ...equal2].forEach(le => {
                    expect(gte(le)(ge)).to.equal(true);
                })
            })
        });

        it('lte', () => {
            grater.forEach(g => {
                less.forEach(l => {
                    expect(lte(g)(l)).to.equal(true);
                    expect(lte(l)(g)).to.equal(false);
                })
            });

            [...grater, ...equal1].forEach(ge => {
                [...less, ...equal2].forEach(le => {
                    expect(lte(ge)(le)).to.equal(true);
                })
            })
        });


    });


});