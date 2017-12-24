import test from 'tapes';

import Shapedom from '../../dist/shapedom';

test('shapedom.createTemplate with text', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('return the same string', function (t) {
    const result = shapedom.createTemplate('hi there');

    t.assert(typeof result === 'string');
    t.assert(result === 'hi there');

    t.end();
  });

  t.end();
});
