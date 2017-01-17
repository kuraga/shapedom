import test from 'tapes';

import Shapedom, { Variable } from '../../dist/shapedom';

test('shapedom.createTemplate with variable', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('text shape', function (t) {
    const result = shapedom.createTemplate(new Variable('hi there'));

    t.assert(typeof result === 'string');

    t.end();
  });

  t.end();
});
