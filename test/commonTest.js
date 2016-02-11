import test from 'tapes';

import ShapeDom from '../shapedom';

test('ShapeDom class', function (t) {
  let shapedom = new ShapeDom(document);

  t.assert(shapedom instanceof ShapeDom);
  t.is(shapedom.document, document);

  t.end();
});
