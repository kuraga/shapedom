import test from 'tapes';

import Shapedom from '../dist/shapedom';

test('Shapedom class', function (t) {
  const shapedom = new Shapedom(document);

  t.assert(shapedom instanceof Shapedom);
  t.is(shapedom.document, document);

  t.end();
});
