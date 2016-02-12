import test from 'tapes';

import Shapedom from '../shapedom';

test('Shapedom class', function (t) {
  let shapedom = new Shapedom(document);

  t.assert(shapedom instanceof Shapedom);
  t.is(shapedom.document, document);

  t.end();
});
