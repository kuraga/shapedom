import test from 'tapes';

import { Variable } from '../dist/shapedom';

let sample = {
  number: -1,
  object: { c: 1, b: -1, a: [ 'Y', 'Z' ] },
  array: [ -1, -2, { e: -3 } ],
  null: null,
  undefined: undefined,
  string: 'dogs'
};

test('Variable', function (t) {
  t.test('constructor', function (t) {
    t.test('construct an instance of Variable', function (t) {
      let variable = new Variable(-1);

      t.assert(variable instanceof Variable);

      t.end();
    });

    t.end();
  });

  t.test('.get', function (t) {
    t.test('should return actual value', function (t) {
      for (let initialValueType of Object.keys(sample)) {
        t.test(`if variable has been constructed with a ${initialValueType} value`, function (t) {
          let variable = new Variable(sample[initialValueType]);

          t.deepEqual(variable.get(), sample[initialValueType]);

          t.end();
        });
      }

      t.end();
    });

    t.end();
  });

  t.test('.set', function (t) {
    t.test('should set new value', function (t) {
      for (let newValueType of Object.keys(sample)) {
        t.test('(' + newValueType + ' value)', function (t) {
          for (let initialValueType of Object.keys(sample)) {
            t.test(`if variable has been constructed with a ${initialValueType} value`, function (t) {
              let variable = new Variable(sample[initialValueType]);
              variable.set(sample[newValueType]);

              t.deepEqual(variable.get(), sample[newValueType]);

              t.end();
            });
          }

          t.end();
        });
      }

      t.end();
    });

    t.end();
  });

  t.end();
});
