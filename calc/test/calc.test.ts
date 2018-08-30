import test from 'ava'
import Calc from '../src/calc'

let calc = new Calc()

// ((((1 + 5) / 4) + 4) * 4 / 5 + (3 + 2)) / 6 + 23 - 54 * (3 + 2) / (2 - 1)
test('add', (t) => {
    t.true(calc.add(0.1, 0.2) === 0.3);
    t.true(calc.add(0.2, 0.1) === 0.3);
    t.true(calc.add(0.02021, 0.0101) === 0.03031);
    t.true(calc.add(0.0101, 0.02021) === 0.03031);
    t.true(calc.add(0, 0) === 0);
    t.true(calc.add(0.00000000002, 0) === 0.00000000002);
    t.true(calc.add(0, 0.00000000002) === 0.00000000002);
    t.true(calc.add(0.0001, 0.00000000002) === 0.00010000002);
    t.true(calc.add(0.00000000002, 0.0001) === 0.00010000002);
    t.true(calc.add(0.0001, 0.1) === 0.1001);
    t.true(calc.add(0.1, 0.0001) === 0.1001);
    t.true(calc.add(0.00000000003, 0.00000000002) === 0.00000000005);
    t.true(calc.add(0.0000000000200, 0.00000000003) === 0.00000000005);
    t.true(calc.add(7, 10) === 17);
    t.true(calc.add(10, 7) === 17);
    t.true(calc.add(7e2, 10) === 710);
    t.true(calc.add(10, 7e2) === 710);
    t.true(calc.add(7e-2, 10) === 10.07);
    t.true(calc.add(7e-2, Infinity) === Infinity);
    t.true(calc.add(7e-2, 1.7976931348623157e309) === Infinity);
    // t.true(calc.add(7e-2, NaN) === NaN);
    // t.true(calc.add(NaN, NaN) === NaN);
});

test('sub', (t) => {
    t.true(calc.sub(0.3, 0.2) === 0.1);
    t.true(calc.sub(0.20142, 0.63873628261836) === -0.43731628261836);
    t.true(calc.sub(0, 0.63873628261836) === -0.63873628261836);
    t.true(calc.sub(0.63873628261836, 0) === 0.63873628261836);
    t.true(calc.sub(3, Infinity) === -Infinity);
    t.true(calc.sub(3, 1.7976931348623157e309) === -Infinity);
    t.true(calc.sub(1.7976931348623157e309, 3) === Infinity);
});
test('mul', (t) => {
    t.true(calc.mul(0.354532, 0.881232) === 0.312424943424);
    t.true(calc.mul(0.354532, 0) ===0);
    t.true(calc.mul(0.354532, Infinity) === Infinity);
    t.true(calc.mul(0.354532, -Infinity) === -Infinity);
    t.true(calc.mul(0.00000, 0.0000) === 0);
    t.true(calc.mul(-0.000001, 2) === -0.000002);
});
test('div', (t) => {
    t.true(calc.div(8, 4) === 2);
    t.true(calc.div(8, 4.0) === 2);
    t.true(calc.div(-0.0000432, 0) === -Infinity);
    t.true(calc.div(0, -0.0000432) === 0);
    t.true(calc.div(0.0001, 0.3452121213) === 2.896769662183933284731969230537e-4);
    t.true(calc.div(0.0001, -0.3452121213) === -2.896769662183933284731969230537e-4);
});
test('表达式', (t) => {
    t.true(calc.calc('4-3+2-1+1.2') === 3.2);
    t.true(calc.calc('4-3*2-1+1.2/0.2') === 3);
    t.true(calc.calc('4/2*3') === 6);
    t.true(calc.calc('(4-3)*2-(1+1.2)/0.2') === -9);
    t.true(calc.calc('((((4-3)*2-1+1.2)+1)+1)/0.2') === 21);
});