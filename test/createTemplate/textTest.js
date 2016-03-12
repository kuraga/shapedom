import test from 'tapes';

import Shapedom from '../../dist/shapedom';

test('shapedom.createTemplate with text shape', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('text shape', function (t) {
    const result = shapedom.createTemplate('hi there');

    t.assert(typeof result === 'string');

    t.end();
  });

  t.end();
});
