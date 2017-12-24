import test from 'tapes';

import Shapedom, { Variable } from '../../dist/shapedom';

test('shapedom.createTemplate with variable', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('return the same variable', function (t) {
    const variable = new Variable('hi there');

    const result = shapedom.createTemplate(variable);

    t.assert(result === variable);

    t.end();
  });

  t.end();
});
