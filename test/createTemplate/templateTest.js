import test from 'tapes';

import Shapedom from '../../dist/shapedom';

test('shapedom.createTemplate with template', function (t) {
  let shapedom;

  t.beforeEach(function (t) {
    shapedom = new Shapedom(document);

    t.end();
  });

  t.test('text shape', function (t) {
    const template = shapedom.createTemplate('hi there');

    const result = shapedom.createTemplate(template);

    t.assert(result === template);

    t.end();
  });

  t.end();
});
